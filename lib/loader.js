"use strict";
let path = require("path");
let version = require("./version");
let debug = require("debug")("loader");

function getModuleData(prefix, moduleName){
  return {name: moduleName.substr(prefix.length), exports: require(moduleName), version: version(moduleName)};
}

function loadPackageFile(directory){
  return require(path.join(directory || process.cwd(), "package.json"));
}

function getModules(prefix){
  let packageFile = loadPackageFile();
  return Object.keys(packageFile.dependencies || {})
    .filter(function(m){ return m.indexOf(prefix) == 0;});
}

function loadAllModules(prefix){
  let modules = getModules(prefix);
  debug("Loading modules : %s", modules.join(", "));
  return modules.map(getModuleData.bind(null, prefix));
};

function loadModule(prefix){
  let modules = getModules(prefix);
  if(modules.length > 0){
    return getModuleData(prefix, modules[0])
  }
  throw new Error("Missing installed modules with prefix " + prefix);
};

module.exports = {
  loadAllModules: loadAllModules,
  loadModule: loadModule,
  loadPackageFile: loadPackageFile
};