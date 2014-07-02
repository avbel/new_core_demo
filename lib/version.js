"use strict";
let path = require("path");
let fs = require("fs");
let debug = require("debug")("version");

module.exports = function(moduleName){
  let directory = path.dirname(require.resolve(moduleName));
  let packageFile = path.join(directory, "package.json");
  while(!fs.existsSync(packageFile)){
    directory = path.dirname(directory);
    if(directory == ".") return "";
    packageFile = path.join(directory, "package.json");
  }
  debug("Reading %s for module %s", packageFile, moduleName);
  let pkg = require(packageFile);
  return pkg.version || "";
}