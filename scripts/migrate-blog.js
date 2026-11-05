'use strict';
// Run locally while the old store is readable, before switching production.
const fs = require('node:fs/promises');
const path = require('node:path');
const blob = require('../lib/blog-blob').createCommand(require('@vercel/blob'));
const database = require('../lib/blog-supabase');
const key = 'welcome-mate:blog:posts:v1';

async function run() {
  const config = {base: process.env.BLOG_SUPABASE_URL, secret: process.env.BLOG_SUPABASE_SECRET};
  const backup = process.argv[2];
  if (!process.env.BLOB_READ_WRITE_TOKEN || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.base) || !config.secret || !backup) {
    throw Error('Configura los tres secretos/variables y proporciona una ruta de respaldo fuera del repositorio.');
  }
  const destination = path.resolve(backup);
  const relative = path.relative(path.resolve(__dirname,'..'), destination);
  if (!relative.startsWith('..'+path.sep) && !path.isAbsolute(relative)) throw Error('Guarda el respaldo fuera del proyecto.');
  const records = (await blob(['HVALS',key])).map(JSON.parse);
  await fs.writeFile(destination, JSON.stringify(records), {flag:'wx'});
  for (const post of records) {
    const existing = await database.command(config,['HGET',key,post.id]);
    if (existing) {
      const saved = JSON.parse(existing);
      if (saved.updated !== post.updated || saved.body !== post.body) throw Error('Conflicto en '+post.id+'. Revisa ambas versiones antes de activar.');
      continue;
    }
    post.images ??= [];
    if (/^assets\/blog\/post-[\w-]+\.jpg$/.test(post.cover)) {
      const bytes = await fs.readFile(path.join(__dirname,'..',post.cover));
      post.cover = 'data:image/jpeg;base64,'+bytes.toString('base64');
    }
    const saved = await database.command(config,['HSET',key,post.id,JSON.stringify(post)]);
    const copy = await database.command(config,['HGET',key,post.id]);
    if (JSON.stringify(JSON.parse(copy).body) !== JSON.stringify(saved.body)) throw Error('Falló la verificación de '+post.id);
  }
  console.log(records.length+' entradas revisadas. Comprueba las portadas y los borradores antes de cambiar Production.');
}
run().catch(error=>{console.error(error.message);process.exitCode=1;});
