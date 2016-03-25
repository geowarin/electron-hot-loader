/* global it,describe,before,after */
'use strict';

const expect = require('expect');

describe('loadJsx', () => {
  before(() => {
    const electronHot = require('../../src/index');
    electronHot.install();
  });

  it('should throw when a component contains an error', () => {
    const exceptionMessage = getExceptionMessage(() => require('./../views/ErrorComponent.jsx'));
    expect(exceptionMessage)
      .toMatch(/^Error compiling [\w\/\-\\:]+?ErrorComponent\.jsx: Parse Error: Line 10: Unexpected token }/);
  });

  it('should throw a simple error when a component contains a component which contains an error', () => {
    const exceptionMessage = getExceptionMessage(() => require('./../views/AppUsingErrorComponent.jsx'));
    expect(exceptionMessage)
      .toMatch(/^Error compiling [\w\/\-\\:]+?ErrorComponent\.jsx: Parse Error: Line 10: Unexpected token }/);
  });

  after(() => {
    delete require.extensions['.jsx'];
  });
});

function getExceptionMessage (executor) {
  let message;
  try {
    executor();
  } catch (e) {
    message = e.message;
  }
  expect(message).toExist('Expected method to throw');
  return message;
}
