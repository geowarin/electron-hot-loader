'use strict';

const watchGlob = require('watch-glob');
const deepForceUpdate = require('react-deep-force-update');

module.exports = function watchJsx(directories, options) {
    const opts = Object.assign({}, options, {callbackArg: 'absolute'});
    watchGlob(directories, opts, f => {
        const cachedProxy = global.proxies[f];
        if (cachedProxy) {
            console.log('Hot reload', f);
            if (!global.rootInstance) {
                console.warn('Root component has not been registered. Make sure that you use ReactDOM.render() in a JSX file' +
                    ' and that require("./electron-hot/jsxTransform").install() has been called before any JSX is required.');
                return;
            }
            delete require.cache[require.resolve(f)];
            var newCompo = require(f);
            cachedProxy.update(newCompo);
            deepForceUpdate(global.rootInstance);
        }
    });
};