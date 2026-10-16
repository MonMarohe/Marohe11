'use strict';
// Vercel Node Function. Redis persists posts across devices and deployments.
const {createHmac, timingSafeEqual, randomBytes, createHash} = require('node:crypto');
const KEY = 'welcome-mate:blog:posts:v1';
const INDEX = 'welcome-mate:blog:index:v1';
const covers = new Set(['assets/about-block-bunny.jpg','assets/build-world-kit.jpg','assets/parfait.jpg','assets/episodio-lima.png','assets/club-polimata-banner.jpg']);
const json = (res,status,data) => { res.statusCode=status; res.setHeader('Content-Type','application/json; charset=utf-8'); res.end(JSON.stringify(data)); };
const settings = () => ({url:process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,password:process.env.BLOG_ADMIN_PASSWORD});
const configured = config => /^https:\/\//.test(config.url || '') && !!config.token && (config.password || '').length >= 16;
async function command(config,args,transaction=false) {
  const response = await fetch(config.url.replace(/\/$/,'')+(transaction?'/multi-exec':''),{method:'POST',headers:{Authorization:`Bearer ${config.token}`,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error('storage');
  const data = await response.json(); if (data.error || transaction && data.some(item=>item.error)) throw new Error('storage'); return transaction ? data.map(item=>item.result) : data.result;
}
function signature(value,password) { return createHmac('sha256',password).update(value).digest('base64url'); }
function same(a,b) { const left=createHash('sha256').update(a || '').digest(),right=createHash('sha256').update(b || '').digest(); return timingSafeEqual(left,right); }
function session(req,config) {
  const cookie=(req.headers.cookie || '').split(';').map(value=>value.trim()).find(value=>value.startsWith('mate_blog='));
  const [value,sig] = (cookie?.slice(10) || '').split('.');
  if (!value || !sig || !same(sig,signature(value,config.password))) return false;
  try { return JSON.parse(Buffer.from(value,'base64url').toString()).expires > Date.now(); } catch { return false; }
}
function setSession(res,config,remove=false) {
  const value = Buffer.from(JSON.stringify({expires:Date.now()+8*3600000,nonce:randomBytes(16).toString('hex')})).toString('base64url');
  res.setHeader('Set-Cookie',`mate_blog=${remove?'':`${value}.${signature(value,config.password)}`}; HttpOnly; Secure; SameSite=Strict; Path=/api/blog; Max-Age=${remove?0:28800}`);
}
async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  let value=''; for await (const chunk of req) { value+=chunk; if (Buffer.byteLength(value)>1000000) throw new Error('size'); }
  return JSON.parse(value || '{}');
}
function validate(post) {
  if (!post || !/^[a-zA-Z0-9_-]{1,100}$/.test(post.id || '')) return false;
  for (const [name,max] of [['title',100],['excerpt',240],['body',8000]]) if (typeof post[name]!=='string' || !post[name].trim() || post[name].length>max) return false;
  return ['Creatividad','Diseño','Recetas','Amor propio','Historias'].includes(post.category) && typeof post.published==='boolean' && (covers.has(post.cover) || typeof post.cover==='string' && post.cover.length<=900000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(post.cover));
}
function preview(post,fullCover=false) {
  return {...post,cover:post.cover?.startsWith('data:') && !fullCover ? `/api/blog?action=cover&id=${encodeURIComponent(post.id)}&v=${encodeURIComponent(post.updated)}` : post.cover};
}
module.exports = async function handler(req,res) {
  res.setHeader('Cache-Control','no-store'); res.setHeader('CDN-Cache-Control','no-store'); res.setHeader('Vercel-CDN-Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  const config=settings(),url=new URL(req.url,'https://welcome-mate.local'),action=url.searchParams.get('action'),ready=configured(config);
  if (req.method==='GET' && action==='status') return json(res,200,{configured:ready});
  if (!ready) return json(res,503,{error:'Falta conectar Storage y configurar la contraseña de administradora en Vercel.',code:'NOT_CONFIGURED'});
  const admin=session(req,config);
  if (!['GET','POST','DELETE'].includes(req.method)) { res.setHeader('Allow','GET, POST, DELETE'); return json(res,405,{error:'Método no permitido.'}); }
  // Mutations are same-origin JSON requests, with an HttpOnly session cookie.
  if (req.method!=='GET') {
    const origin=req.headers.origin,host=req.headers.host;
    let allowedOrigin=false;try{allowedOrigin=!!origin && new URL(origin).host===host;}catch{}
    if (!allowedOrigin || !req.headers['content-type']?.startsWith('application/json')) return json(res,403,{error:'Solicitud no permitida.'});
  }
  try {
    if (req.method==='POST' && action==='login') {
      const ip=(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
      const rateKey=`welcome-mate:blog:login:${createHash('sha256').update(ip).digest('hex')}`;
      const count=await command(config,['INCR',rateKey]); if(count===1) await command(config,['EXPIRE',rateKey,600]);
      if (count>10) return json(res,429,{error:'Demasiados intentos. Espera diez minutos.'});
      const input=await body(req);
      if (typeof input.password!=='string' || !same(input.password,config.password)) return json(res,401,{error:'La contraseña no es correcta.'});
      setSession(res,config); return json(res,200,{ok:true});
    }
    if (req.method==='POST' && action==='logout') { setSession(res,config,true); return json(res,200,{ok:true}); }
    const id=url.searchParams.get('id');
    if (id && !/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return json(res,400,{error:'Entrada no válida.'});
    if (req.method==='GET' && id) {
      const raw=await command(config,['HGET',KEY,id]); const post=raw?JSON.parse(raw):null;
      if (!post || !post.published && !admin) return json(res,404,{error:'Entrada no encontrada.'});
      if (action==='cover') {
        const match=/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(post.cover || '');
        if (!match) return json(res,404,{error:'Portada no encontrada.'});
        res.statusCode=200; res.setHeader('Content-Type',`image/${match[1]}`); return res.end(Buffer.from(match[2],'base64'));
      }
      if (action==='edit' && !admin) return json(res,401,{error:'Ingresa como administradora.'});
      return json(res,200,{post:preview(post,action==='edit' && admin)});
    }
    if (req.method==='GET') {
      const all=action==='admin'; if (all && !admin) return json(res,401,{error:'Ingresa como administradora.'});
      const values=await command(config,['HVALS',INDEX]);
      const posts=(values || []).map(value=>JSON.parse(value)).filter(post=>all || post.published).sort((a,b)=>b.created.localeCompare(a.created)).map(post=>preview(post));
      return json(res,200,{posts});
    }
    if (!admin) return json(res,401,{error:'Tu sesión terminó. Ingresa como administradora.'});
    if (req.method==='DELETE') {
      if (!id) return json(res,400,{error:'Falta la entrada.'});
      await command(config,[['HDEL',KEY,id],['HDEL',INDEX,id]],true); return json(res,200,{ok:true});
    }
    const input=await body(req);
    if (!validate(input.post)) return json(res,400,{error:'Revisa título, categoría, resumen, artículo y portada.'});
    const oldRaw=await command(config,['HGET',KEY,input.post.id]),old=oldRaw?JSON.parse(oldRaw):null;
    if (!old) {
      const count=await command(config,['HLEN',KEY]); if (count>=200) return json(res,409,{error:'Este blog admite hasta 200 entradas. Archiva o elimina alguna para continuar.'});
    }
    const now=new Date().toISOString();
    const post={id:input.post.id,title:input.post.title.trim(),category:input.post.category,excerpt:input.post.excerpt.trim(),body:input.post.body.trim(),cover:input.post.cover,published:input.post.published,created:old?.created || (Number.isFinite(Date.parse(input.post.created))?new Date(input.post.created).toISOString():now),updated:now};
    // Keep the feed lightweight: uploaded photo bytes are fetched per image, never in the list.
    await command(config,[['HSET',KEY,post.id,JSON.stringify(post)],['HSET',INDEX,post.id,JSON.stringify(preview(post))]],true);
    return json(res,200,{post:preview(post)});
  } catch { return json(res,502,{error:'No se pudo conectar con el blog. Vuelve a intentarlo.'}); }
};
