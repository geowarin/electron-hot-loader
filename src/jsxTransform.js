'use strict';

var installed = false;
var inlineSourceMap = require('jstransform/src/inline-source-map');

module.exports.install = install;
module.exports.transform = transform;

function transform (filename, source, options) {
  const jsxVisitors = require('./transforms/react-jsx-visitors').visitorList;
  const requireVisitor = require('./transforms/custom-require-visitor');
  const topLevelVisitor = require('./transforms/top-level-render-visitor');
  const higherOrderVisitor = require('./transforms/higher-order-visitor');
  const classVisitor = require('./transforms/react-class-visitor');
  const jstransform = require('jstransform');

  let visitors = [];
  if (options.doNotInstrument !== true) {
    visitors = visitors
      .concat(classVisitor)
      .concat(higherOrderVisitor)
      .concat(requireVisitor)
      .concat(topLevelVisitor);
  }
  visitors = visitors.concat(jsxVisitors);

  let result;
  if (options.sourceMapInline) {
    const opts = Object.assign(options, {
      sourceMap: true,
      filename: filename
    });
    result = jstransform.transform(visitors, source, opts);
    const map = inlineSourceMap(result.sourceMap, source, filename);
    result.code = result.code + '\n' + map;
  } else {
    result = jstransform.transform(visitors, source, options);
  }

  return result.code;
}

function install (options) {
  if (installed) {
    return;
  }

  options = options || {};
  if (!options.hasOwnProperty('sourceMapInline')) {
    options.sourceMapInline = true;
  }
  if (!options.hasOwnProperty('extension')) {
    options.extension = '.jsx';
  }

  require.extensions[options.extension] = function loadJsx (module, filename) {
    var content = require('fs').readFileSync(filename, 'utf8');
    var instrumented = tryInstrumenting(filename, content, options);
    tryCompiling(module, instrumented, filename);
  };
  installed = true;
}

function tryInstrumenting (filename, content, options) {
  try {
    var instrumented = transform(filename, content, options);
  } catch (e) {
    // When instrumenting nested components, we want to see only
    // the first, happening in the innermost component
    if (e.originalError) {
      throw e.originalError;
    }
    e.message = 'Error compiling ' + filename + ': ' + e.message;
    e.originalError = e;
    throw e;
  }
  return instrumented;
}

function tryCompiling (module, instrumented, filename) {
  try {
    module._compile(instrumented, filename);
  } catch (e) {
    // Chrome does not always show the stack trace
    // Better show it twice than never
    console.error(e.stack);
    throw e;
  }
}
