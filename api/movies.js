'use strict';
const {createHandler}=require('../lib/movies/handler');
module.exports=createHandler('movies');
module.exports.createHandler=service=>createHandler('movies',service);
