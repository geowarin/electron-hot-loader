'use strict';

const watchGlob = require('glob-watcher');

module.exports = function watchCss (directories, options) {
  const watcher = watchGlob(directories, options);
  watcher.on('all', (event, f) => {
    console.debug('Css hot reload', f);
    var links = document.getElementsByTagName('link');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];

      if (link.href.indexOf('css') > -1) {
        link.href = link.href + '?id=' + new Date().getMilliseconds();
      }
    }
  });
};
