/* global describe it */
'use strict';

const expect = require('expect');
const jsxTransform = require('../../src/jsxTransform');

const fs = require('fs');

describe('jsxTransform', () => {
  it('should transform a JSX file without instrumenting it', () => {
    expectTransformation(
      {doNotInstrument: true},
      './test/fixtures/simple_transform_input.jsx',
      './test/fixtures/simple_transform_result.jsx'
    );
  });

  it('should transform a JSX file and instrument it', () => {
    expectTransformation(
      {},
      './test/fixtures/transform_and_instrument_input.jsx',
      './test/fixtures/transform_and_instrument_result.jsx'
    );
  });

  it('should transform a JSX file, instrument it and keep the source map', () => {
    expectTransformation(
      {sourceMapInline: true},
      './test/fixtures/transform_and_instrument_input.jsx',
      './test/fixtures/transform_and_instrument_result_with_source_map.jsx'
    );
  });

  it('should transform and instrument React top level render', () => {
    expectTransformation(
      {},
      './test/fixtures/transform_and_instrument_top_level_input.jsx',
      './test/fixtures/transform_and_instrument_top_level_result.jsx'
    );
  });

  it('should transform and instrument higher order components', () => {
    expectTransformation(
      {higherOrderFunctions: ['connect']},
      './test/fixtures/higher_order_component_input.jsx',
      './test/fixtures/higher_order_component_result.jsx'
    );
  });

  it('should instrument higher order components in the same file', () => {
    expectTransformation(
      {higherOrderFunctions: ['connect']},
      './test/fixtures/higher_order_component_infile_input.jsx',
      './test/fixtures/higher_order_component_infile_result.jsx'
    );
  });

  it('should not instrument components in node_modules', () => {
    expectTransformation(
      {},
      './test/fixtures/do_not_instrument_modules_input.jsx',
      './test/fixtures/do_not_instrument_modules_result.jsx'
    );
  });
});

// When the token _ignore_ is found in the expected output,
// we replace it in the actual output until a new line is found
// Used to avoid comparing base64 source maps in tests
function replaceIgnored (expected, transformed) {
  const ignoreRegexp = /_ignore_/g;
  let match;
  while ((match = ignoreRegexp.exec(expected)) !== null) {
    let until = transformed.indexOf('\n', match.index);
    if (until === -1) {
      until = transformed.length;
    }
    transformed = transformed.substring(0, match.index) + match[0] + transformed.substring(until);
  }
  return transformed;
}

function expectTransformation (options, fileToTransform, actualFile) {
  const input = fs.readFileSync(fileToTransform).toString();
  let transformed = jsxTransform.transform(fileToTransform, input, options);

  let expected = fs.readFileSync(actualFile).toString();

  expected = expected.replace(/_electronHotLocation_/m, require.resolve('../../src/proxies').replace(/\\/g, '/'));
  transformed = replaceIgnored(expected, transformed);

  expect(transformed).toEqual(expected);
}
