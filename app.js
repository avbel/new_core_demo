"use strict";
let co = require("co");
let core = require("./lib"); // will be require("labs_core"); in real project

co(core())(function(err){
  if(err){
    console.error(err.stack);
  }
});