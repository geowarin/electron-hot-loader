"use strict";

var installed = false;
var inlineSourceMap = require('jstransform/src/inline-source-map');

module.exports.install = install;
module.exports.transform = transform;

function transform(filename, source, options) {

    const jsxVisitors = require('./transforms/react-jsx-visitors').visitorList;
    const requireVisitor = require('./transforms/custom-require-visitor');
    const topLevelVisitor = require('./transforms/top-level-render-visitor');
    const jstransform = require('jstransform');

    let visitors = [];
    if (options.doNotInstrument !== true) {
        visitors = visitors.concat(requireVisitor).concat(topLevelVisitor);
    }
    visitors = visitors.concat(jsxVisitors);

    let result;
    if (options.sourceMapInline) {
        result = jstransform.transform(visitors, source, {
            sourceMap: true,
            filename: filename,
            doNotInstrument: options.doNotInstrument
        });
        var map = inlineSourceMap(result.sourceMap, source, filename);
        result.code = result.code + '\n' + map;
    } else {
        result = jstransform.transform(visitors, source, {doNotInstrument: options.doNotInstrument});
    }

    return result.code;
}

function install(options) {
    if (installed) {
        return;
    }

    options = options || {};
    if (!options.hasOwnProperty('sourceMapInline')) {
        options.sourceMapInline = true;
    }

    require.extensions[options.extension || '.jsx'] = function loadJsx(module, filename) {
        var content = require('fs').readFileSync(filename, 'utf8');
        try {
            var instrumented = transform(filename, content, options);
            module._compile(instrumented, filename);
        } catch (e) {
            if (e.originalError) {
                throw e.originalError;
            }
            e.message = 'Error compiling ' + filename + ': ' + e.message;
            e.originalError = e;
            throw e;
        }
    };
    installed = true
}
