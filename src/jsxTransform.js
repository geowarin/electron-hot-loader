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
	return
    }

    var fs = require('fs');
    var Module = require('module');
    var _require = Module.prototype.require;

    options = options || {};

    Module._extensions[options.extension || '.jsx'] = function (module, filename) {
	if (!options.hasOwnProperty('sourceMapInline')) {
	    options.sourceMapInline = true
	}

	var content = fs.readFileSync(filename, 'utf8');
	try {
	    var instrumented = transform(filename, content, options);
	    module._compile(instrumented, filename)
	} catch (e) {
	    console.error("Error compiling " + filename, e);
	    console.error(e.stack);
	}
    };

    Module.prototype.require = function (filename) {
	if ('!' === filename.slice(-1)) {
	    filename = filename.slice(0, -1)
	}
	return _require.call(this, filename)
    };

    installed = true
}