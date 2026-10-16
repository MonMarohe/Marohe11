'use strict';
const {headers,json,requireGet,ApiError}=require('../restaurants/http');
const {createMovieService,parseFilters,numberParam}=require('./service');
const shared=createMovieService();
function createHandler(kind,service=shared){return async function(req,res){
 headers(res);
 try{
  requireGet(req,res);const params=new URL(req.url,'http://localhost').searchParams;
  if(kind==='movies'){const filters=parseFilters(params);service.checkRate(req);return json(res,200,await service.movies(filters));}
  if(kind==='details'){for(const name of params.keys())if(name!=='id'||params.getAll(name).length!==1)throw new ApiError(400,'INVALID_ID','Película no válida.');const id=numberParam(params,'id',1,2147483647,false);service.checkRate(req);return json(res,200,await service.details(id));}
  if([...params.keys()].length)throw new ApiError(400,'INVALID_FILTER','Solicitud no válida.');
  service.checkRate(req);return json(res,200,await service.platforms());
 }catch(error){const known=error instanceof ApiError;if(known&&error.retryAfter)res.setHeader('Retry-After',String(error.retryAfter));return json(res,known?error.status:503,{message:known?error.message:'No pudimos consultar el catálogo de cine.',code:known?error.code:'MOVIES_UNAVAILABLE'});}
};}
module.exports={createHandler};
