"use strict";
let co = require("co");
let core = require("./lib");

co(core())(function(err){
  if(err){
    console.error(err.stack);
  }
});