'use strict';
const seeds=require('../data/blog-posts.json');
const PREFIX='marohe/blog/posts/';
const POSTS='welcome-mate:blog:posts:v1';
const INDEX='welcome-mate:blog:index:v1';
function createCommand(blob){
  // Best-effort per-instance login throttling; no anonymous writes to Blob.
  const attempts=new Map();
  const path=id=>PREFIX+id+'.json';
  async function read(pathname){
    const result=await blob.get(pathname,{access:'private',useCache:false});
    if(!result)return null;
    if(result.statusCode!==200 || !result.stream)throw new Error('storage');
    return JSON.parse(await new Response(result.stream).text());
  }
  async function all(){
    const page=await blob.list({prefix:PREFIX,limit:201});
    if(page.hasMore)throw new Error('limit');
    const records=new Map(seeds.map(post=>[post.id,post]));
    for(let i=0;i<page.blobs.length;i+=10){
      const batch=await Promise.all(page.blobs.slice(i,i+10).map(entry=>read(entry.pathname)));
      for(const record of batch)if(record){if(record.deleted)records.delete(record.id);else records.set(record.id,record);}
    }
    return [...records.values()];
  }
  async function command(args,transaction=false){
    if(transaction){const result=[];for(const item of args)result.push(await command(item));return result;}
    const [op,key,id,value]=args;
    if(op==='INCR'){
      const now=Date.now();
      for(const [key,entry] of attempts)if(entry.until<now)attempts.delete(key);
      if(!attempts.has(key)&&attempts.size>=1000)return 11;
      const entry=attempts.get(key)||{count:0,until:now+600000};entry.count++;attempts.set(key,entry);return entry.count;
    }
    if(op==='EXPIRE')return 1;
    if(![POSTS,INDEX].includes(key))throw new Error('unsupported storage key');
    if(['HGET','HSET','HDEL'].includes(op)&&!/^[a-zA-Z0-9_-]{1,100}$/.test(id||''))throw new Error('invalid id');
    if(op==='HGET'){
      const post=await read(path(id))||seeds.find(post=>post.id===id);
      return post&&!post.deleted?JSON.stringify(post):null;
    }
    if(op==='HVALS')return(await all()).map(post=>JSON.stringify(post));
    if(op==='HLEN')return(await all()).length;
    // The Blob document is the only source of truth. The Redis feed-index write is unnecessary here.
    if(key===INDEX)return 1;
    if(op==='HSET'){
      await blob.put(path(id),value,{access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:true});return 1;
    }
    if(op==='HDEL'){
      if(seeds.some(post=>post.id===id))await blob.put(path(id),JSON.stringify({id,deleted:true}),{access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:true});
      else await blob.del(path(id));
      return 1;
    }
    throw new Error('unsupported storage operation');
  }
  return command;
}
module.exports={createCommand};
