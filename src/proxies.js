'use strict';

const createProxy = require('react-proxy/modules/index');

const proxies = {};
let rootInstance;

module.exports.register = register;
module.exports.registerRoot = registerRoot;
module.exports.getProxy = getProxy;
module.exports.getRoot = getRoot;

function registerRoot (root) {
  rootInstance = root;
}

function register (Component, location) {
  const proxy = createProxy.default(Component);

  if (!proxies[location]) {
    console.debug('Registered proxy', location);
    proxies[location] = proxy;
  }
  return proxies[location].get();
}

function getProxy (location) {
  return proxies[location];
}

function getRoot () {
  return rootInstance;
}
