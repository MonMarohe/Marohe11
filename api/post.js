'use strict';
const blogHandler=require('./blog');
const content=require('../src/js/blog-content');
const seeds=require('../data/blog-posts.json');
const ORIGIN='https://marohe11.vercel.app';
const escape=value=>String(value||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
async function publishedPost(id){
 let status=200,body='';
 await blogHandler({method:'GET',url:'/api/blog?id='+encodeURIComponent(id),headers:{}},{set statusCode(v){status=v},setHeader(){},end(v){body=v}});
 if(status===503)return seeds.find(post=>post.id===id)||null;
 if(status===404)return null;
 if(status!==200)throw new Error('storage');
 const post=JSON.parse(body).post;
 return post?.published?post:null;
}
function createHandler(load=publishedPost){return async(req,res)=>{
 res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
 if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;return res.end('Método no permitido');}
 const id=new URL(req.url,ORIGIN).searchParams.get('id');
 if(!/^[a-zA-Z0-9_-]{1,100}$/.test(id||'')){res.statusCode=404;return res.end('Artículo no encontrado');}
 let post;try{post=await load(id);}catch{res.statusCode=503;return res.end('No pudimos cargar el artículo. Intenta de nuevo más tarde.');}
 if(!post?.published){res.statusCode=404;return res.end('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Artículo no disponible · MAROHE</title><h1>Este artículo no está publicado.</h1><a href="/#blog">Volver al blog</a></html>');}
 const canonical=ORIGIN+'/blog/'+encodeURIComponent(id);
 const replacements={'assets/about-block-bunny.jpg':'assets/welcome-mate-boba-pixel.jpg','assets/build-world-kit.jpg':'assets/welcome-mate-kit-matcha.jpg','assets/boba-taro-classic.jpg':'assets/welcome-mate-boba-purple.jpg'};
 const cover=replacements[post.cover]||post.cover;
 const image=/^(assets\/[a-zA-Z0-9_./-]+|\/api\/blog\?action=cover&)/.test(cover||'')?new URL(cover,ORIGIN).href:ORIGIN+'/assets/marohe-stained-hearts.jpg';
 const title=escape(post.title),excerpt=escape(post.excerpt),url=escape(canonical),img=escape(image);
 res.statusCode=200;
 if(req.method==='HEAD')return res.end();
 return res.end(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · MAROHE</title><meta name="description" content="${excerpt}"><link rel="canonical" href="${url}"><meta property="og:type" content="article"><meta property="og:site_name" content="MAROHE"><meta property="og:locale" content="es_PE"><meta property="og:title" content="${title}"><meta property="og:description" content="${excerpt}"><meta property="og:url" content="${url}"><meta property="og:image" content="${img}"><meta property="og:image:alt" content="${title}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${excerpt}"><meta name="twitter:image" content="${img}"><link rel="icon" href="/assets/marohe-icon.svg"><style>*{box-sizing:border-box}body{margin:0;background:#150d16;color:#f9eef4;font-family:Arial,sans-serif}header,main,footer{max-width:1000px;margin:auto;padding:24px}header{display:flex;align-items:center;justify-content:space-between;gap:24px;border-bottom:1px solid #644052}header img{width:130px}a{color:#ffb2d9;text-underline-offset:5px}nav{display:flex;gap:20px;flex-wrap:wrap}article{max-width:780px;margin:36px auto}h1{font:400 clamp(36px,6vw,65px)/1.1 Georgia,serif;margin:20px 0}p{font-size:18px;line-height:1.85}.category{letter-spacing:.16em;font-size:12px;color:#f2aacd}.cover{width:100%;max-height:600px;object-fit:contain;background:#211625;border-radius:18px;margin:25px 0}.blog-inline-image{margin:30px 0}.blog-inline-image img{display:block;width:100%;height:auto;border-radius:14px}.blog-inline-image figcaption{font-size:14px;color:#e0bed2;text-align:center;padding:10px}.excerpt{color:#e0bed2;font-size:21px}.share{display:flex;gap:20px;flex-wrap:wrap;border-top:1px solid #644052;padding:25px 0;margin-top:35px}footer{font-size:14px;color:#d4b4c6}@media(max-width:600px){header{align-items:start;flex-direction:column}nav{font-size:13px;gap:16px}article{margin:10px auto}.cover{margin:15px 0}p{font-size:17px}}</style></head><body><header><a href="/"><img src="/assets/marohe-brand-2026.png" alt="MAROHE"></a><nav><a href="/#inicio">HOME</a><a href="/#blog">BLOG</a><a href="/#play">PLAY</a><a href="/#tienda">TIENDA</a></nav></header><main><article><span class="category">${escape(post.category)} · MAROHE</span><h1>${title}</h1><p class="excerpt">${excerpt}</p><img class="cover" src="${img}" alt="${title}">${content.render(post.body,post.images)}<div class="share"><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}" target="_blank" rel="noopener">Compartir en Facebook ↗</a><a href="https://wa.me/?text=${encodeURIComponent(post.title+' '+canonical)}" target="_blank" rel="noopener">Compartir por WhatsApp ↗</a><a href="/#blog">Volver al blog</a></div></article></main><footer>MAROHE · Arte, creatividad y espiritualidad ♡</footer></body></html>`);
};}
module.exports=createHandler();module.exports.createHandler=createHandler;
