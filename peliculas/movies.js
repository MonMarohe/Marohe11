(() => {
 'use strict';
 const $=id=>document.getElementById(id),form=$('filters'),DAY=86400000,CACHE_KEY='marohe.movies.cache.v1',HISTORY_KEY='marohe.movies.history.v1',fileMode=location.protocol==='file:';
 // A clearly labelled local preview, adapted from the user's supplied example.
 // These are not API responses, TMDB IDs, posters, or verified platform listings.
 const sampleRows=[
  ['Perfect Days',2023,124,[18],['cozy','think'],'Un hombre encuentra poesía en los pequeños rituales de Tokio.'],
  ['Past Lives',2023,106,[18,10749],['cry','think'],'Dos amigos de infancia vuelven a encontrarse años después.'],
  ['Everything Everywhere All at Once',2022,139,[28,12,878,35],['joy','think','cry'],'Una familia encuentra nuevas posibilidades en un multiverso.'],
  ['The Boy and the Heron',2023,124,[16,12,14],['think','cozy','adventure'],'Un niño se adentra en un mundo fantástico.'],
  ['Amélie',2001,129,[35,10749],['cozy','joy'],'Pequeños gestos cambian la vida de una camarera parisina.'],
  ['Parasite',2019,132,[18,53,35],['think','joy','scream'],'Dos familias y una casa cruzan sus historias.'],
  ['Spirited Away',2001,125,[16,12,14],['cozy','think','adventure'],'Una niña trata de regresar de un mundo de espíritus.'],
  ['Eternal Sunshine of the Spotless Mind',2004,108,[18,10749,878],['cry','think'],'Un amor intenta sobrevivir a sus recuerdos.'],
  ['La La Land',2016,128,[10402,18,10749],['cry','cozy'],'Dos artistas persiguen sus sueños en Los Ángeles.'],
  ['Her',2013,126,[18,10749,878],['cry','think'],'Una conexión inesperada cambia la vida de un hombre.'],
  ['Little Miss Sunshine',2006,101,[35,18],['joy','cry','cozy'],'Una familia viaja junta hacia un concurso infantil.'],
  ['Frances Ha',2012,86,[35,18],['joy','cozy','think'],'Una bailarina busca su lugar en Nueva York.']
 ];
 const samples=sampleRows.map((row,i)=>({id:'sample-'+i,title:row[0],year:row[1],runtime:row[2],genreIds:row[3],moods:row[4],overview:row[5],rating:null,posterUrl:null,sample:true}));
 let cache=read(CACHE_KEY,{}),history=read(HISTORY_KEY,[]);
 if(!cache||typeof cache!=='object'||Array.isArray(cache))cache={};if(!Array.isArray(history))history=[];
 history=history.filter(validMovie).slice(0,12);
 const state={list:[],selected:null,demo:false,spinning:false,timer:null,loadTimer:null,controller:null,detailController:null,generation:0,detailGeneration:0};
 function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
 function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
 function status(text,error=false){$('status').textContent=text;$('status').classList.toggle('is-error',error);}
 function validMovie(movie){return movie&&((Number.isSafeInteger(movie.id)&&movie.id>0)||/^sample-\d+$/.test(movie.id))&&typeof movie.title==='string'&&movie.title.length>0&&movie.title.length<=200;}
 function imageURL(value){try{const url=new URL(value);return url.protocol==='https:'&&url.hostname==='image.tmdb.org'&&/^\/t\/p\/(?:w92|w185|w342|w500|original)\/[a-zA-Z0-9_-]+\.(?:jpg|png|webp)$/.test(url.pathname)?url.href:null;}catch{return null;}}
 function movieRecord(movie){return {id:movie.id,title:movie.title.slice(0,200),year:movie.year,runtime:movie.runtime,overview:String(movie.overview||'').slice(0,1600),rating:Number.isFinite(movie.rating)?movie.rating:null,posterUrl:imageURL(movie.posterUrl),sample:movie.sample===true};}
 function cacheGet(key){const record=cache[key];return record&&Number.isFinite(record.at)&&Date.now()-record.at>=0&&Date.now()-record.at<DAY?record.data:null;}
 function cachePut(key,data){cache[key]={at:Date.now(),data};const entries=Object.entries(cache).filter(([,v])=>v&&Number.isFinite(v.at)&&Date.now()-v.at<DAY).sort((a,b)=>b[1].at-a[1].at).slice(0,16);cache=Object.fromEntries(entries);if(!save(CACHE_KEY,cache))$('filter-note').textContent='El navegador no pudo guardar la lista. Puedes seguir girando durante esta visita.';}
 function filters(){const data=new FormData(form);return Object.fromEntries(['genre','mood','duration','provider','yearFrom','yearTo'].map(k=>[k,String(data.get(k)||'')]));}
 function update(){
  $('spin').disabled=state.spinning||!!state.controller||!state.list.length;
  $('refresh').disabled=!!state.controller;
  $('candidate-count').textContent=state.list.length+ (state.demo?' pelis de muestra':' pelis para tu mood');
  $('another').disabled=state.spinning||!!state.controller||!state.list.length;
 }
 function setup(){/* La selección local queda silenciosa y lista para girar; no mostramos una portada ni instrucciones técnicas. */$('setup-help').hidden=true;}
 function sampleList(){const f=filters();return samples.filter(m=>(!f.genre||m.genreIds.includes(Number(f.genre)))&&(!f.mood||m.moods.includes(f.mood))&&(!f.yearFrom||m.year>=Number(f.yearFrom))&&(!f.yearTo||m.year<=Number(f.yearTo))&&(f.duration==='any'||!f.duration||f.duration==='short'&&m.runtime<90||f.duration==='medium'&&m.runtime>=90&&m.runtime<=120||f.duration==='long'&&m.runtime>120));}
 function useSample(){state.demo=true;state.list=sampleList();$('platform').disabled=true;$('filter-note').textContent='Selección local lista para girar.';setup();resetReels();update();status(state.list.length?'¡Dale un giro!':'No hay pelis con estos filtros. Prueba otra combinación.');}
 async function api(url,signal){const response=await fetch(url,{signal,headers:{Accept:'application/json'}});if(!(response.headers.get('content-type')||'').includes('application/json'))throw new Error('No se pudo conectar con el catálogo de películas. Revisa la configuración del proyecto en Vercel.');const data=await response.json();if(!response.ok)throw new Error(data.message||'No pudimos consultar las películas.');return data;}
 function stopSpin(){clearTimeout(state.timer);state.spinning=false;$('machine').classList.remove('is-spinning');update();}
 function invalidate(){stopSpin();state.selected=null;$('result').hidden=true;$('empty-state').hidden=false;state.detailGeneration++;state.detailController?.abort();$('movie-details').hidden=true;}
 function schedule(){clearTimeout(state.loadTimer);state.controller?.abort();state.controller=null;state.generation++;invalidate();state.list=[];update();status('Preparando tus películas…');state.loadTimer=setTimeout(()=>loadMovies(),250);}
 async function loadMovies(force=false){
  clearTimeout(state.loadTimer);invalidate();const f=filters();
  if(!form.reportValidity()||f.yearFrom&&f.yearTo&&Number(f.yearFrom)>Number(f.yearTo)){state.list=[];update();status('Revisa el rango de años: el inicio debe ir antes del final.',true);return;}
  if(fileMode){useSample();return;}
  const key='discover:'+new URLSearchParams(f).toString(),saved=force?null:cacheGet(key);
  if(saved&&Array.isArray(saved.movies)){
   state.demo=false;state.list=saved.movies.filter(validMovie).map(movieRecord);$('platform').disabled=false;$('setup-help').hidden=true;$('filter-note').textContent='Tu lista se guarda durante 24 horas. Los giros eligen de ella; las plataformas corresponden a Perú.';resetReels();update();status('Tu lista guardada está lista para girar.');return;
  }
  state.controller?.abort();const controller=new AbortController(),generation=++state.generation;state.controller=controller;state.list=[];update();status('Buscando historias en TMDB…');
  try{
   const params=new URLSearchParams(f);if(force)params.set('refresh','1');const data=await api('/api/movies?'+params,controller.signal);if(generation!==state.generation)return;
   if(data.configured===false){state.controller=null;useSample();return;}
   state.demo=false;state.list=(Array.isArray(data.movies)?data.movies:[]).filter(validMovie).map(movieRecord);cachePut(key,{movies:state.list});$('platform').disabled=false;$('setup-help').hidden=true;$('filter-note').textContent='Tu lista se guarda durante 24 horas. Los giros eligen de ella; las plataformas corresponden a Perú.';resetReels();status(state.list.length?'¡Tu próxima historia está aquí! Gira cuando quieras.':'No encontramos películas con estos filtros. Prueba otra combinación.');
  }catch(error){if(error.name!=='AbortError'&&generation===state.generation){state.controller=null;useSample();status('Catálogo local listo para girar.',true);}}
  finally{if(generation===state.generation){state.controller=null;update();}}
 }
 async function loadPlatforms(){
  if(fileMode)return;try{let data=cacheGet('platforms:PE');if(!data){data=await api('/api/movie-platforms');if(data.configured!==false)cachePut('platforms:PE',data);}if(data.configured===false)return;const selected=form.elements.provider.value;$('platform').replaceChildren(new Option('Cualquiera',''));for(const p of data.platforms||[])if(Number.isSafeInteger(p.id)&&typeof p.name==='string')$('platform').add(new Option(p.name,String(p.id)));form.elements.provider.value=selected;}catch{/* Search can work even if the platform list is temporarily unavailable. */}
 }
 function random(length){const a=new Uint32Array(1),cap=Math.floor(4294967296/length)*length;do{crypto.getRandomValues(a);}while(a[0]>=cap);return a[0]%length;}
 function placeholder(movie){const name=movie.title.replace(/[<>&"']/g,'');const colors=['#ef9dc9','#bca2e8','#7edaca','#ffe177'];const color=colors[(String(movie.id).length+name.length)%colors.length];const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 540"><rect width="360" height="540" fill="${color}"/><rect x="21" y="21" width="318" height="498" rx="20" fill="none" stroke="#211329" stroke-width="4"/><circle cx="180" cy="212" r="88" fill="#fff5"/><path d="m157 168 76 44-76 44z" fill="#211329"/><text x="180" y="90" text-anchor="middle" font-family="Arial" font-size="21" font-weight="bold" fill="#211329">MAROHE MOVIE CLUB</text><text x="180" y="385" text-anchor="middle" font-family="Arial" font-size="16" fill="#211329">MAROHE CINE</text><text x="180" y="448" text-anchor="middle" font-family="Arial" font-size="19" font-weight="bold" fill="#211329">${movie.year||'CINE'}</text></svg>`;return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);}
 function poster(img,movie){img.alt=(movie.sample?'Portada ilustrativa de muestra: ':'Póster de ')+movie.title;img.src=imageURL(movie.posterUrl)||placeholder(movie);img.onerror=()=>{img.onerror=null;img.src=placeholder(movie);};}
 function row(movie){const node=document.createElement('div');node.className='reel-item';const img=document.createElement('img');poster(img,movie);const title=document.createElement('strong');title.className='reel-title';title.textContent=movie.title;node.append(img,title);return node;}
 function resetReels(){for(let i=0;i<3;i++){const reel=$('reel-'+i);reel.style.transition='none';reel.style.transform='translateY(0)';if(state.list.length)reel.replaceChildren(row(state.list[i%state.list.length]));}}
 function spin(){
  if(state.spinning||state.controller||!state.list.length)return;
  invalidate();const winner=state.list[random(state.list.length)],generation=state.generation,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  state.spinning=true;$('empty-state').hidden=true;$('machine').classList.add('is-spinning');update();status('El azar está buscando tu próxima historia…');
  const length=reduced?3:18;
  for(let i=0;i<3;i++){
   const reel=$('reel-'+i),finish=i===1?winner:state.list[random(state.list.length)],rows=[row(finish)];
   for(let j=0;j<length;j++)rows.push(row(state.list[random(state.list.length)]));reel.replaceChildren(...rows);reel.style.transition='none';const height=reel.firstElementChild.getBoundingClientRect().height;reel.style.transform=`translateY(${-length*height}px)`;void reel.offsetHeight;reel.style.transition=`transform ${reduced?60:1700+i*160}ms cubic-bezier(.15,.7,.15,1)`;reel.style.transform='translateY(0)';
  }
  state.timer=setTimeout(()=>{if(generation!==state.generation)return;state.spinning=false;$('machine').classList.remove('is-spinning');state.selected=winner;showResult(winner);history=[movieRecord(winner),...history.filter(m=>m.id!==winner.id)].slice(0,12);save(HISTORY_KEY,history);renderHistory();update();status((state.demo?'Muestra · ':'')+'Hoy toca '+winner.title+'.');},reduced?120:2100);
 }
 function meta(movie){$('result-meta').replaceChildren();for(const value of [movie.year,Number.isFinite(movie.rating)?'★ '+movie.rating.toFixed(1):null,movie.runtime?movie.runtime+' min':null,movie.sample?'MUESTRA':null].filter(Boolean)){const span=document.createElement('span');span.textContent=value;$('result-meta').append(span);}}
 function showResult(movie){state.detailGeneration++;state.detailController?.abort();$('result-title').textContent=movie.title;poster($('result-poster'),movie);$('result-overview').textContent=movie.overview||'Una nueva historia por descubrir.';meta(movie);$('movie-details').hidden=true;$('details-status').textContent='';$('details').hidden=false;$('details').disabled=false;$('result').hidden=false;$('empty-state').hidden=true;}
 function externalLink(value,hosts){try{const url=new URL(value);return url.protocol==='https:'&&hosts.includes(url.hostname)?url.href:null;}catch{return null;}}
 function renderDetails(movie){
  meta(movie);const trailer=externalLink(movie.trailerUrl,['www.youtube.com']),watch=externalLink(movie.watchUrl,['www.justwatch.com']);
  $('trailer-link').hidden=!trailer;if(trailer)$('trailer-link').href=trailer;$('watch-link').hidden=!watch;if(watch)$('watch-link').href=watch;$('trailer-unavailable').hidden=!!trailer;$('trailer-unavailable').textContent=movie.sample?'Los tráilers se activan al conectar TMDB.':'No encontramos un tráiler en YouTube para esta peli.';
  $('result-platforms').replaceChildren();for(const provider of movie.providers||[]){const chip=document.createElement('span');chip.className='provider-chip';const logo=imageURL(provider.logoUrl);if(logo){const img=document.createElement('img');img.src=logo;img.alt='';chip.append(img);}chip.append(document.createTextNode(provider.name||''));$('result-platforms').append(chip);}
  document.querySelector('.availability-note').hidden=movie.sample===true;
  $('movie-details').hidden=false;$('details').hidden=true;
 }
 async function details(){
  const movie=state.selected;if(!movie||state.spinning)return;
  const generation=++state.detailGeneration;
  if(movie.sample){renderDetails({...movie,trailerUrl:null,watchUrl:'https://www.justwatch.com/pe/buscar?q='+encodeURIComponent(movie.title),providers:[]});$('details-status').textContent='Modo muestra: abre JustWatch para buscar el título. Conecta TMDB para consultar el tráiler y la disponibilidad actual.';return;}
  const saved=cacheGet('detail:'+movie.id);if(saved){renderDetails(saved);return;}
  state.detailController?.abort();const controller=new AbortController();state.detailController=controller;$('details').disabled=true;$('details-status').textContent='Abriendo la ficha de cine…';
  try{const data=await api('/api/movie-details?id='+movie.id,controller.signal);if(generation!==state.detailGeneration||state.selected?.id!==movie.id)return;if(data.configured===false||!validMovie(data.movie))throw new Error(data.message||'No pudimos abrir esta ficha.');cachePut('detail:'+movie.id,data.movie);renderDetails(data.movie);$('details-status').textContent='';}
  catch(error){if(error.name!=='AbortError'&&generation===state.detailGeneration)$('details-status').textContent=error.message;}
  finally{if(generation===state.detailGeneration){state.detailController=null;$('details').disabled=false;}}
 }
 function renderHistory(){
  $('history-count').textContent=String(history.length);$('clear-history').hidden=!history.length;$('history-list').replaceChildren();
  if(!history.length){const p=document.createElement('p');p.textContent='Aquí empiezan tus próximas historias.';$('history-list').append(p);return;}
  for(const movie of history){const button=document.createElement('button');button.type='button';button.className='history-card';const img=document.createElement('img');poster(img,movie);img.loading='lazy';const title=document.createElement('strong');title.textContent=movie.title;const year=document.createElement('small');year.textContent=String(movie.year||'')+(movie.sample?' · Muestra':'');button.append(img,title,year);button.onclick=()=>{stopSpin();state.selected=movie;showResult(movie);$('result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});};$('history-list').append(button);}
 }
 $('spin').onclick=spin;$('another').onclick=spin;$('details').onclick=details;$('refresh').onclick=()=>loadMovies(true);
 form.addEventListener('submit',event=>{event.preventDefault();loadMovies();});form.addEventListener('change',schedule);form.addEventListener('reset',()=>setTimeout(schedule,0));
 document.querySelectorAll('[data-mood]').forEach(button=>button.onclick=()=>{form.elements.mood.value=button.dataset.mood;schedule();});
 $('clear-history').onclick=()=>{history=[];save(HISTORY_KEY,history);renderHistory();};
 $('clear-storage').onclick=()=>{cache={};history=[];try{localStorage.removeItem(CACHE_KEY);localStorage.removeItem(HISTORY_KEY);}catch{}renderHistory();status('Borramos las listas y el historial guardados de Pelis. Puedes seguir girando la lista de esta visita.');};
 const year=new Date().getFullYear();form.elements.yearFrom.max=String(year);form.elements.yearTo.max=String(year);
 const tmdbLogo=document.querySelector('.tmdb-brand img');
 function logoFallback(){if(tmdbLogo&&!tmdbLogo.hidden){tmdbLogo.hidden=true;tmdbLogo.parentElement.append(document.createTextNode('TMDB'));}}
 tmdbLogo?.addEventListener('error',logoFallback,{once:true});if(tmdbLogo?.complete&&!tmdbLogo.naturalWidth)logoFallback();
 addEventListener('pagehide',()=>{stopSpin();clearTimeout(state.loadTimer);state.controller?.abort();state.detailController?.abort();});
 renderHistory();loadPlatforms();loadMovies();
})();
