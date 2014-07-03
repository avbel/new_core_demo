"use strict";

module.exports = function*(plugin){
  yield plugin.dependency(["koa", "plugin1"]); //will wait of running of koa and plugin1
  plugin.logger.debug("Running plugin %s@%s", plugin.name, plugin.version);
  plugin.logger.debug(yield plugin.container.resolve("lazyInstance")); //=> {ready: true}
  plugin.logger.debug(yield plugin.container.resolveAll("lazyInstances")); //=> array of {number: XXXX}

  let internalContainer = plugin.container.createScopedContainer();
  internalContainer.register("item1", 1); //'item1' will be available inside internalContainer only

  plugin.logger.debug(internalContainer.resolve("item1")); //=> 1
  plugin.logger.debug(internalContainer.resolve("appInfo").name); //=>demo (getting parent container value)

  plugin.logger.debug(plugin.container.resolve("item1", {throwError: false})); //=> undefined (parent container doesn't contain 'item1')
};

