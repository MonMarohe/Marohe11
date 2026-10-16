'use strict';
const {createHandler}=require('../lib/movies/handler');
module.exports=createHandler('platforms');
module.exports.createHandler=service=>createHandler('platforms',service);
