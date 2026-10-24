'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createHandler}=require('../api/blog');
const {createCommand}=require('../lib/blog-blob');
function response(){return{headers:{},setHeader(k,v){this.headers[k]=v;},end(value){this.raw=value;try{this.body=JSON.parse(value);}catch{}}};}
function req(method,url,body,cookie=''){return{method,url,body,headers:{host:'example.vercel.app',origin:'https://example.vercel.app','content-type':'application/json',cookie}};}
test('private Blob blog publishes uploaded cover, protects drafts, and persists updates/deletion',async()=>{
 const names=['UPSTASH_REDIS_REST_URL','KV_REST_API_URL','UPSTASH_REDIS_REST_TOKEN','KV_REST_API_TOKEN','BLOG_ADMIN_PASSWORD','BLOB_READ_WRITE_TOKEN','NEWSLETTER_ADMIN_PASSWORD'];
 const before=Object.fromEntries(names.map(n=>[n,process.env[n]]));names.forEach(n=>delete process.env[n]);
 process.env.BLOB_READ_WRITE_TOKEN='test';process.env.NEWSLETTER_ADMIN_PASSWORD='test-password-long-enough';
 const records=new Map();
 const blob={async get(p,o){assert.equal(o.access,'private');return records.has(p)?{statusCode:200,stream:new Blob([records.get(p)]).stream()}:null;},async put(p,v,o){assert.equal(o.access,'private');assert.equal(o.allowOverwrite,true);records.set(p,v);},async list({prefix}){return{blobs:[...records.keys()].filter(p=>p.startsWith(prefix)).map(pathname=>({pathname})),hasMore:false};},async del(p){records.delete(p);}};
 const command=createCommand(blob);const handler=createHandler((config,args,transaction)=>command(args,transaction));
 async function call(method,url,body,cookie){const r=response();await handler(req(method,url,body,cookie),r);return r;}
 try{
  assert.equal((await call('GET','/api/blog?action=status')).body.configured,true);
  assert.equal((await call('GET','/api/blog?action=admin')).statusCode,401);
  const login=await call('POST','/api/blog?action=login',{password:'test-password-long-enough'});assert.equal(login.statusCode,200);
  const cookie=login.headers['Set-Cookie'].split(';')[0];
  const post={id:'test-post',title:'Mi artículo',excerpt:'Resumen',body:'Texto privado',category:'Creatividad',cover:'data:image/png;base64,aGVsbG8=',published:false};
  assert.equal((await call('POST','/api/blog',{post})).statusCode,401);
  assert.equal((await call('POST','/api/blog',{post},cookie)).statusCode,200);
  assert.equal((await call('GET','/api/blog?id=test-post')).statusCode,404);
  assert.equal((await call('GET','/api/blog?action=cover&id=test-post')).statusCode,404);
  assert.ok(!(await call('GET','/api/blog')).body.posts.some(p=>p.id===post.id));
  post.published=true;post.body='Publicado';
  assert.equal((await call('POST','/api/blog',{post},cookie)).statusCode,200);
  const published=await call('GET','/api/blog?id=test-post');assert.equal(published.body.post.body,'Publicado');assert.match(published.body.post.cover,/^\/api\/blog\?action=cover/);
  const cover=await call('GET',published.body.post.cover);assert.equal(cover.headers['Content-Type'],'image/png');assert.equal(cover.raw.toString(),'hello');
  post.published=false;await call('POST','/api/blog',{post},cookie);assert.equal((await call('GET','/api/blog?id=test-post')).statusCode,404);
  await call('DELETE','/api/blog?id=test-post',{},cookie);assert.equal(records.size,0);
  const seed=require('../data/blog-posts.json')[0];await call('DELETE','/api/blog?id='+seed.id,{},cookie);assert.equal((await call('GET','/api/blog?id='+seed.id)).statusCode,404);
 }finally{for(const n of names){if(before[n]===undefined)delete process.env[n];else process.env[n]=before[n];}}
});
