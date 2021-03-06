'use strict';

const watchGlob = require('watch-glob');
const deepForceUpdate = require('react-deep-force-update');
const proxies = require('./proxies');

module.exports = function watchJsx (directories, options) {
  const opts = Object.assign({}, options, {callbackArg: 'absolute'});
  watchGlob(directories, opts, f => {
    if (proxies.hasProxies(f)) {
      console.debug('Hot reload', f);
      const rootInstance = proxies.getRoot();
      if (!rootInstance) {
        console.warn('Root component has not been registered. Make sure that you use ReactDOM.render() in a JSX file' +
          ' and that require("electron-hot-loader").install() has been called before any JSX is required.');
        return;
      }

      delete require.cache[f];
      let module = require(f);

      proxies.updateProxies(f, module);

      deepForceUpdate(rootInstance);
    }
  });
};
