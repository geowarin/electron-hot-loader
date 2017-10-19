'use strict';

const path = require('path');

const watchGlob = require('glob-watcher');
const deepForceUpdate = require('react-deep-force-update');
const proxies = require('./proxies');

module.exports = function watchJsx (directories, options) {
  const watcher = watchGlob(directories, options);
  watcher.on('all', (event, f) => {
    const absPath = path.resolve(path.join(options.cwd || '.', f));
    if (proxies.hasProxies(absPath)) {
      console.debug('Hot reload', absPath);
      const rootInstance = proxies.getRoot();
      if (!rootInstance) {
        console.warn('Root component has not been registered. Make sure that you use ReactDOM.render() in a JSX file' +
          ' and that require("electron-hot-loader").install() has been called before any JSX is required.');
        return;
      }

      delete require.cache[absPath];
      let module = require(absPath);

      proxies.updateProxies(absPath, module);

      deepForceUpdate(rootInstance);
    }
  });
};
