'use strict';

const watchGlob = require('watch-glob');

module.exports = function watchCss (directories, options) {
  const opts = Object.assign({}, options, {callbackArg: 'absolute'});
  watchGlob(directories, opts, f => {
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
