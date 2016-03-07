"use strict";

const expect = require('expect');
const jsxTransform = require('../../src/jsxTransform');

const fs = require('fs');

function expectTransformation(options, fileToTransform, actualFile) {
    const input = fs.readFileSync(fileToTransform).toString();
    const transformed = jsxTransform.transform(input, options);
    let expected = fs.readFileSync(actualFile).toString();
    expected = expected.replace(/_electronHotLocation_/m, require.resolve('../../src/'));
    expect(transformed).toEqual(expected);
}

describe('jsxTransform', () => {

    it('should transform a JSX file without instrumenting it', () => {
	expectTransformation(
	    {doNotInstrument: true, react: true},
	    './test/fixtures/simple_transform_input.jsx',
	    './test/fixtures/simple_transform_result.jsx'
	)
    });

    it('should transform a JSX file and instrument it', () => {
	expectTransformation(
	    {react: true},
	    './test/fixtures/transform_and_instrument_input.jsx',
	    './test/fixtures/transform_and_instrument_result.jsx'
	)
    });
});
