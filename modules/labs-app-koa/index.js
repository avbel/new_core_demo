"use strict";
let koa = require("koa");
module.exports = function*(config){
  let app = koa();
  return {
    app: app,
    getRequestHandler: function(){ return app.callback();}
  };
};
