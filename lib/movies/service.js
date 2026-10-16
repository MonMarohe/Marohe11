'use strict';
const {ApiError,requestIdentity}=require('../restaurants/http');
const DAY=86400000;
const GENRES=new Set([28,12,16,35,80,99,18,10751,14,36,27,10402,9648,10749,878,53,10752,37]);
const MOODS={joy:[35],cry:[10749,18],scream:[27],adventure:[12,28],think:[878,9648],cozy:[16,10751,14]};
const imageUrl=(value,size='w500')=>typeof value==='string'&&/^\/[a-zA-Z0-9_-]+\.(?:jpg|png|webp)$/.test(value)?`https://image.tmdb.org/t/p/${size}${value}`:null;
const clean=(value,max=1600)=>typeof value==='string'?value.replace(/[\u0000-\u001f]/g,' ').trim().slice(0,max):'';
function numberParam(params,key,min,max,optional=true){
 const raw=params.get(key);if((raw===null||raw==='')&&optional)return null;
 if(!/^\d+$/.test(raw||''))throw new ApiError(400,'INVALID_FILTER','Revisa los filtros de películas.');
 const value=Number(raw);if(!Number.isSafeInteger(value)||value<min||value>max)throw new ApiError(400,'INVALID_FILTER','Revisa los filtros de películas.');return value;
}
function parseFilters(params,now=Date.now()){
 const allowed=new Set(['genre','mood','yearFrom','yearTo','duration','provider','refresh']);
 for(const key of params.keys())if(!allowed.has(key)||params.getAll(key).length!==1)throw new ApiError(400,'INVALID_FILTER','Filtro de películas no válido.');
 const year=new Date(now).getUTCFullYear(),genre=numberParam(params,'genre',1,99999),provider=numberParam(params,'provider',1,999999);
 const yearFrom=numberParam(params,'yearFrom',1900,year),yearTo=numberParam(params,'yearTo',1900,year);
 const mood=params.get('mood')||'',duration=params.get('duration')||'any';
 if(genre&&!GENRES.has(genre)||mood&&!Object.hasOwn(MOODS,mood)||!['any','short','medium','long'].includes(duration)||yearFrom&&yearTo&&yearFrom>yearTo||params.has('refresh')&&!['','0','1'].includes(params.get('refresh')))throw new ApiError(400,'INVALID_FILTER','Revisa el género, mood y rango de años.');
 return {genre,mood,yearFrom,yearTo,duration,provider,refresh:params.get('refresh')==='1'};
}
function normalizeMovie(movie){
 if(!movie||!Number.isSafeInteger(movie.id)||movie.id<1||!clean(movie.title,200))return null;
 return {id:movie.id,title:clean(movie.title,200),year:/^\d{4}-/.test(movie.release_date||'')?Number(movie.release_date.slice(0,4)):null,posterUrl:imageUrl(movie.poster_path),overview:clean(movie.overview),rating:typeof movie.vote_average==='number'&&movie.vote_average>=0&&movie.vote_average<=10?movie.vote_average:null};
}
function createMovieService(options={}){
 const env=options.env||process.env,key=(env.TMDB_API_KEY||'').trim(),fetcher=options.fetch||fetch,now=options.now||Date.now;
 const cache=new Map(),flights=new Map(),rates=new Map();let quotaDay='',quota=0;
 const ready=()=>!!key;
 function checkRate(req){
  const time=now(),bucket=Math.floor(time/600000),id=requestIdentity(req,key)+':'+bucket;
  const count=(rates.get(id)||0)+1;rates.set(id,count);
  if(rates.size>2000)for(const name of rates.keys())if(!name.endsWith(':'+bucket))rates.delete(name);
  if(count>60)throw new ApiError(429,'RATE_LIMIT','Espera un momento antes de volver a consultar.',60);
 }
 async function upstream(endpoint,params){
  const day=new Date(now()).toISOString().slice(0,10);if(day!==quotaDay){quotaDay=day;quota=0;}
  if(quota>=(options.dailyLimit??1000))throw new ApiError(429,'DAILY_LIMIT','Las consultas de cine están en pausa por hoy. Puedes seguir girando tu lista guardada.',3600);
  quota++;
  const url=new URL('https://api.themoviedb.org/3/'+endpoint);for(const [name,value]of Object.entries(params||{}))if(value!==null&&value!==undefined&&value!=='')url.searchParams.set(name,String(value));url.searchParams.set('api_key',key);
  let response;
  try{response=await fetcher(url.href,{headers:{Accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(8000)});}
  catch{throw new ApiError(503,'TMDB_UNAVAILABLE','No pudimos conectar con TMDB. Prueba otra vez; tu lista guardada sigue disponible.');}
  if(response.status===429)throw new ApiError(429,'TMDB_LIMIT','TMDB está recibiendo muchas consultas. Prueba más tarde.',60);
  if(response.status===401||response.status===403)throw new ApiError(503,'TMDB_CONFIGURATION','La clave de TMDB necesita revisarse en el servidor.');
  if(response.status===404)throw new ApiError(404,'NOT_FOUND','No encontramos esta película en TMDB.');
  if(!response.ok)throw new ApiError(503,'TMDB_UNAVAILABLE','TMDB no pudo completar la consulta. Inténtalo más tarde.');
  try{return await response.json();}catch{throw new ApiError(503,'INVALID_RESPONSE','TMDB devolvió una respuesta que no pudimos leer.');}
 }
 async function cached(name,load,refresh=false){
  const old=cache.get(name);if(!refresh&&old&&now()-old.at<DAY)return old.value;
  if(flights.has(name))return flights.get(name);
  const pending=(async()=>{const value=await load();cache.delete(name);cache.set(name,{at:now(),value});while(cache.size>100)cache.delete(cache.keys().next().value);return value;})();
  flights.set(name,pending);try{return await pending;}finally{flights.delete(name);}
 }
 async function movies(filters){
  if(!ready())return {configured:false,movies:[],message:'Conecta TMDB_API_KEY para descubrir películas del catálogo de TMDB.'};
  const {refresh,...canonical}=filters;
  return cached('discover:'+JSON.stringify(canonical),async()=>{
   const params={language:'es-PE',region:'PE',include_adult:false,include_video:false,sort_by:'popularity.desc',page:1,'primary_release_date.lte':filters.yearTo?`${filters.yearTo}-12-31`:new Date(now()).toISOString().slice(0,10)};
   if(filters.yearFrom)params['primary_release_date.gte']=`${filters.yearFrom}-01-01`;
   if(filters.yearTo===new Date(now()).getUTCFullYear())params['primary_release_date.lte']=new Date(now()).toISOString().slice(0,10);
   if(filters.genre)params.with_genres=filters.genre;else if(filters.mood)params.with_genres=MOODS[filters.mood].join('|');
   if(filters.duration==='short'){params['with_runtime.gte']=1;params['with_runtime.lte']=89;}
   if(filters.duration==='medium'){params['with_runtime.gte']=90;params['with_runtime.lte']=120;}
   if(filters.duration==='long')params['with_runtime.gte']=121;
   if(filters.provider){params.watch_region='PE';params.with_watch_providers=filters.provider;}
   const data=await upstream('discover/movie',params);
   if(!Array.isArray(data.results))throw new ApiError(503,'INVALID_RESPONSE','No pudimos leer la lista de películas.');
   const records=data.results.filter(m=>!m.adult&&(!filters.genre||!filters.mood||Array.isArray(m.genre_ids)&&m.genre_ids.some(id=>MOODS[filters.mood].includes(id))));
   return {configured:true,movies:records.map(normalizeMovie).filter(Boolean).slice(0,20),fetchedAt:now(),source:'TMDB',message:records.length?'':'No encontramos películas con esta combinación. Prueba otros filtros.'};
  },refresh);
 }
 async function platforms(){
  if(!ready())return {configured:false,platforms:[],message:'Conecta TMDB para consultar las plataformas en Perú.'};
  return cached('platforms:PE',async()=>{
   const data=await upstream('watch/providers/movie',{language:'es',watch_region:'PE'});
   if(!Array.isArray(data.results))throw new ApiError(503,'INVALID_RESPONSE','No pudimos leer las plataformas.');
   const seen=new Set();return {configured:true,platforms:data.results.filter(p=>Number.isSafeInteger(p.provider_id)&&p.provider_id>0&&clean(p.provider_name,100)&&!seen.has(p.provider_id)&&seen.add(p.provider_id)).map(p=>({id:p.provider_id,name:clean(p.provider_name,100),logoUrl:imageUrl(p.logo_path,'w92')})),fetchedAt:now()};
  });
 }
 async function details(id){
  if(!ready())return {configured:false,movie:null,message:'Conecta TMDB para abrir el tráiler y la ficha.'};
  return cached('movie:'+id,async()=>{
   const data=await upstream('movie/'+id,{language:'es-PE',append_to_response:'videos,watch/providers','include_video_language':'es,en,null'}),movie=normalizeMovie(data);
   if(!movie)throw new ApiError(503,'INVALID_RESPONSE','No pudimos leer esta ficha de cine.');
   const trailers=(Array.isArray(data.videos?.results)?data.videos.results:[]).filter(v=>v.site==='YouTube'&&/^[a-zA-Z0-9_-]{6,32}$/.test(v.key||'')&&['Trailer','Teaser'].includes(v.type));
   trailers.sort((a,b)=>(Number(b.iso_639_1==='es')*4+Number(b.official)*2+Number(b.type==='Trailer'))-(Number(a.iso_639_1==='es')*4+Number(a.official)*2+Number(a.type==='Trailer')));
   const regional=data['watch/providers']?.results?.PE||{},seen=new Set(),providers=[];
   for(const kind of ['flatrate','free','ads','rent','buy'])for(const provider of regional[kind]||[]){if(!Number.isSafeInteger(provider.provider_id)||!clean(provider.provider_name,100)||seen.has(provider.provider_id))continue;seen.add(provider.provider_id);providers.push({id:provider.provider_id,name:clean(provider.provider_name,100),logoUrl:imageUrl(provider.logo_path,'w92'),kind});}
   return {configured:true,movie:{...movie,runtime:Number.isFinite(data.runtime)&&data.runtime>0?data.runtime:null,trailerUrl:trailers[0]?'https://www.youtube.com/watch?v='+trailers[0].key:null,watchUrl:'https://www.justwatch.com/pe/buscar?q='+encodeURIComponent(movie.title),providers},fetchedAt:now()};
  });
 }
 return {ready,checkRate,movies,platforms,details};
}
module.exports={createMovieService,parseFilters,normalizeMovie,numberParam,MOODS,imageUrl};
