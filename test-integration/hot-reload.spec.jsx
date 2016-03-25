/* global it */
'use strict';

const expect = require('expect');
const describeWithDom = require('describe-with-dom');

describeWithDom('loadJsx', () => {

  before(() => {
    const electronHot = require('../src/index');
    electronHot.install();
  });

  it('should load a JSX file', () => {
    require('./views/index.jsx');
    var window = document.defaultView;
    expect(window.document.documentElement.outerHTML).toContain('Hello');
  });

  after(() => {
    delete require.extensions['.jsx'];
  });
});
