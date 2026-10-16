'use strict';
const {createHandler}=require('../lib/movies/handler');
module.exports=createHandler('details');
module.exports.createHandler=service=>createHandler('details',service);
