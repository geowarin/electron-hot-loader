/* global it */
'use strict';

const expect = require('expect');
const describeWithDom = require('describe-with-dom');

const React = require('react');
const ReactDOM = require('react-dom');

describeWithDom('loadJsx', () => {
  it('should load a JSX file', () => {
    const App = require('./views/App.jsx');
    const element = document.createElement('div');
    document.body.appendChild(element);
    ReactDOM.render(<App/>, element);

    var window = document.defaultView;
    expect(window.document.documentElement.outerHTML).toContain('Hello');
  });

  it('should throw when a component contains an error', () => {
    const exceptionMessage = getExceptionMessage(() => require('./views/ErrorComponent.jsx'));
    expect(exceptionMessage)
      .toMatch(/^Error compiling [\w\/\-\\]+?ErrorComponent\.jsx: Parse Error: Line 10: Unexpected token }/);
  });

  it('should throw a simple error when a component contains a component which contains an error', () => {
    const exceptionMessage = getExceptionMessage(() => require('./views/AppUsingErrorComponent.jsx'));
    expect(exceptionMessage)
      .toMatch(/^Error compiling [\w\/\-\\]+?ErrorComponent\.jsx: Parse Error: Line 10: Unexpected token }/);
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
