'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createHandler}=require('../api/blog');
function response(){return{headers:{},setHeader(k,v){this.headers[k]=v;},end(value){this.raw=value;try{this.body=JSON.parse(value);}catch{}}};}
function req(method,url,body,cookie=''){return{method,url,body,headers:{host:'example.vercel.app',origin:'https://example.vercel.app','content-type':'application/json',cookie}};}
test('Supabase-backed blog publishes uploaded cover, protects drafts, and persists updates/deletion',async()=>{
 const names=['BLOG_SUPABASE_URL','BLOG_SUPABASE_SECRET','BLOG_ADMIN_PASSWORD','BLOB_READ_WRITE_TOKEN','NEWSLETTER_ADMIN_PASSWORD'];
 const before=Object.fromEntries(names.map(n=>[n,process.env[n]]));names.forEach(n=>delete process.env[n]);
 process.env.BLOG_SUPABASE_URL='https://demo.supabase.co';process.env.BLOG_SUPABASE_SECRET='sb_secret_test';process.env.NEWSLETTER_ADMIN_PASSWORD='test-password-long-enough';
 const records=new Map();
 async function command(args,transaction=false){if(transaction)return Promise.all(args.map(item=>command(item)));const [op,key,id,value]=args;if(op==='INCR'||op==='EXPIRE')return 1;if(op==='HGET')return records.get(id)||null;if(op==='HSET'){records.set(id,value);return JSON.parse(value);}if(op==='HDEL'){records.delete(id);return 1;}if(op==='HVALS')return [...records.values()];if(op==='HLEN')return records.size;throw Error('unexpected command');}
 const feed=async(_config,{admin})=>({posts:[...records.values()].map(JSON.parse).filter(post=>admin||post.published).map(post=>({id:post.id,title:post.title,cover:'/api/blog?action=cover&id='+post.id,category:post.category,excerpt:post.excerpt,created:post.created,updated:post.updated,published:post.published}))});
 const handler=createHandler((config,args,transaction)=>command(args,transaction),feed);
 async function call(method,url,body,cookie){const r=response();await handler(req(method,url,body,cookie),r);return r;}
 try{
  assert.equal((await call('GET','/api/blog?action=status')).body.configured,true);
  assert.equal((await call('GET','/api/blog?action=admin')).statusCode,401);
  const login=await call('POST','/api/blog?action=login',{password:'test-password-long-enough'});assert.equal(login.statusCode,200);
  const cookie=login.headers['Set-Cookie'].split(';')[0];
  const post={id:'test-post',title:'Mi artículo',excerpt:'Resumen',body:'Texto privado',category:'Creatividad',cover:'data:image/png;base64,aGVsbG8=',published:false,images:[{id:'foto-1',src:'data:image/png;base64,aGVsbG8=',alt:'Pie de foto'}]};
  assert.equal((await call('POST','/api/blog',{post})).statusCode,401);
  assert.equal((await call('POST','/api/blog',{post},cookie)).statusCode,200);
  assert.equal((await call('GET','/api/blog?id=test-post')).statusCode,404);
  assert.equal((await call('GET','/api/blog?action=cover&id=test-post')).statusCode,404);
  assert.equal((await call('GET','/api/blog?action=image&id=test-post&image=foto-1')).statusCode,404);
  assert.ok(!(await call('GET','/api/blog')).body.posts.some(p=>p.id===post.id));
  post.published=true;post.body='Publicado';
  assert.equal((await call('POST','/api/blog',{post},cookie)).statusCode,200);
  const published=await call('GET','/api/blog?id=test-post');assert.equal(published.body.post.body,'Publicado');
  const photoUrl=published.body.post.images[0].src;
  assert.ok(!(JSON.stringify((await call('GET','/api/blog')).body)).includes('aGVsbG8='));
  const invalid=[Array(5).fill(post.images[0]),[{...post.images[0],src:'javascript:alert(1)'}],[{...post.images[0],alt:'x'.repeat(161)}]];
  for(const images of invalid)assert.equal((await call('POST','/api/blog',{post:{...post,images}},cookie)).statusCode,400);
  await call('DELETE','/api/blog?id=test-post',{},cookie);assert.equal(records.size,0);
  const seed=require('../data/blog-posts.json')[0];await call('DELETE','/api/blog?id='+seed.id,{},cookie);assert.equal((await call('GET','/api/blog?id='+seed.id)).statusCode,404);
 }finally{for(const n of names){if(before[n]===undefined)delete process.env[n];else process.env[n]=before[n];}}
});
