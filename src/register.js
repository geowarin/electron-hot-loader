"use strict";

const createProxy = require('react-proxy/modules/index');

global.proxies = {};

module.exports = function register(Component, location) {
    const proxy = createProxy.default(Component);

    if (!global.proxies[location]) {
        console.debug('Registered proxy', location);
        global.proxies[location] = proxy;
    }
    return global.proxies[location].get();
};