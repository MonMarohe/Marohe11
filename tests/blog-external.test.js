'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const database = require('../lib/blog-supabase');
const config = {base:'https://demo.supabase.co',secret:'sb_secret_test'};
test('external storage keeps image bytes out of articles and paginates public summaries', async t=>{
  const calls=[];
  t.mock.method(globalThis,'fetch',async (url,options)=>{
    calls.push({url,options});
    assert.ok(options.signal instanceof AbortSignal);
    if(url.includes('?select='))return Response.json(Array.from({length:25},(_,i)=>({id:'post-'+i})));
    return new Response(null,{status:201});
  });
  const record={id:'post-test',cover:'data:image/jpeg;base64,YQ==',images:[]};
  const saved=await database.command(config,['HSET','marohe:blog:posts',record.id,JSON.stringify(record)]);
  assert.match(saved.cover,/\/object\/public\/marohe-blog\/[a-f0-9]{64}\.jpeg$/);
  assert.ok(!calls[1].options.body.includes('base64'));
  const page=await database.feed(config,{after:'post-test'});
  assert.equal(page.posts.length,24);
  assert.equal(page.next,'post-23');
  const query=new URL(calls.at(-1).url).searchParams;
  assert.equal(query.get('post->>published'),'eq.true');
  assert.equal(query.get('id'),'lt.post-test');
  assert.ok(!query.get('select').includes('body'));
});
