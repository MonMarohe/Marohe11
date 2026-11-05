'use strict';
const {createHash}=require('node:crypto');
const bucket='marohe-blog';
async function request(config,path,options={}){
  const response=await fetch(config.base+path,{...options,redirect:'error',
    headers:{apikey:config.secret,...(config.secret.startsWith('sb_secret_')?{}:{Authorization:'Bearer '+config.secret}),...options.headers},
    signal:AbortSignal.timeout(6500)});
  if(!response.ok)throw new Error('Blog storage HTTP '+response.status);
  return response;
}
async function media(config,src){
  if(!src.startsWith('data:'))return src;
  const [,type,data]=/^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(src);
  const bytes=Buffer.from(data,'base64');
  const path='/storage/v1/object/'+bucket+'/'+createHash('sha256').update(bytes).digest('hex')+'.'+type;
  await request(config,path,{method:'POST',headers:{'Content-Type':'image/'+type,'x-upsert':'true'},body:bytes});
  return config.base+path.replace('/object/','/object/public/');
}
async function feed(config,{after='',admin=false}={}){
  const fields='id,title:post->>title,cover:post->>cover,category:post->>category,excerpt:post->>excerpt,created:post->>created,updated:post->>updated,published:post->published';
  const q=new URLSearchParams({select:fields,order:'id.desc',limit:'25'});
  if(!admin)q.set('post->>published','eq.true');
  if(after)q.set('id','lt.'+after);
  const rows=await(await request(config,'/rest/v1/marohe_posts?'+q)).json();
  return {posts:rows.slice(0,24),next:rows.length>24?rows[23].id:null};
}
async function command(config,[op,key,id,value]){
  const table='/rest/v1/marohe_posts';
  const filter='?id=eq.'+encodeURIComponent(id||'');
  if(op==='HGET'){
    const rows=await (await request(config,table+filter+'&select=post')).json();
    return rows.length?JSON.stringify(rows[0].post):null;
  }
  if(op==='HVALS' && key.includes(':blog:')){
    const out=[];
    for(let offset=0;;offset+=100){
      const rows=await(await request(config,table+'?select=post&order=id&limit=100&offset='+offset)).json();
      out.push(...rows.map(row=>JSON.stringify(row.post)));
      if(rows.length<100)return out;
    }
  }
  if(key.endsWith(':index:v1'))return 1;
  if(op==='HDEL'){await request(config,table+filter,{method:'DELETE'});return 1;}
  if(op==='HSET'){
    const post=JSON.parse(value);
    const [cover,...urls]=await Promise.all([post.cover,...post.images.map(i=>i.src)].map(src=>media(config,src)));
    post.cover=cover;post.images.forEach((img,i)=>img.src=urls[i]);
    await request(config,table,{method:'POST',headers:{'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},body:JSON.stringify({id,post})});
    return post;
  }
  throw new Error('Unsupported blog command');
}
module.exports={command,feed};
