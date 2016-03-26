/* global it,describe,before,beforeEach,after,afterEach */
'use strict';

const expect = require('expect');
let errors = [];
let savedConsoleError;

describe('Error handling', () => {
  before(() => {
    const electronHot = require('../../src/index');
    electronHot.install();
  });

  beforeEach(() => {
    errors = [];
    savedConsoleError = console.error;
    console.error = (arg) => errors.push(arg);
  });

  it('should show helpful information', () => {
    const exceptionMessage = getExceptionMessage(() => require('./../views/AppUsingErrorScript.jsx'));
    expect(exceptionMessage)
      .toMatch(/^unknownFunction is not defined$/);
    expect(errors[0]).toMatch(/[\w\/\-\\:]+?error\.js:2:1/);
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

  afterEach(() => {
    errors = [];
    console.error = savedConsoleError;
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
