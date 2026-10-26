'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MaroheBlogContent=api;})(typeof window==='object'?window:globalThis,()=>{
 const escape=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const validData=src=>typeof src==='string' && src.length<=600000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(src);
 const safeSource=src=>validData(src) || typeof src==='string' && /^\/api\/blog\?action=image&id=[a-zA-Z0-9_-]+&image=[a-zA-Z0-9_-]+&v=[a-zA-Z0-9%_.:-]+$/.test(src);
 function validImages(images){return images===undefined || Array.isArray(images) && images.length<=4 && new Set(images.map(i=>i?.id)).size===images.length && images.every(i=>i && /^[a-zA-Z0-9_-]{1,60}$/.test(i.id) && validData(i.src) && typeof i.alt==='string' && i.alt.length<=160);}
 function render(body,images=[]){
  const byId=new Map((Array.isArray(images)?images:[]).map(i=>[i.id,i]));
  return String(body||'').split(/(\[\[imagen:[a-zA-Z0-9_-]+\]\])/g).map(part=>{
   const match=/^\[\[imagen:([a-zA-Z0-9_-]+)\]\]$/.exec(part);
   if(match){const i=byId.get(match[1]);return i && safeSource(i.src)?'<figure class="blog-inline-image"><img src="'+escape(i.src)+'" alt="'+escape(i.alt)+'" loading="lazy" decoding="async">'+(i.alt?'<figcaption>'+escape(i.alt)+'</figcaption>':'')+'</figure>':'';}
   return part.split(/\n\s*\n/).filter(p=>p.trim()).map(p=>'<p>'+escape(p.trim()).replace(/\n/g,'<br>')+'</p>').join('');
  }).join('');
 }
 return {render,validImages,validData};
});
