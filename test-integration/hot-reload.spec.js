/* global describe,it,before,after */
'use strict';

const expect = require('expect');
var jsdom = require('jsdom-global');
const fs = require('fs');
const os = require('os');
const path = require('path');
const temp = require('temp').track();

let rootDir;
let cleanup;

describe('loadJsx', function () {
  this.timeout(5000);

  before(() => {
    cleanup = jsdom();
    const electronHot = require('../src/index');
    electronHot.install();

    rootDir = temp.mkdirSync('electron-hot');
    createTempJsx('./views/index.jsx');
    createTempJsx('./views/App.jsx');

    // Strange bug on OSX
    const cwd = os.platform() === 'darwin' ? '/private' + rootDir : rootDir;
    electronHot.watchJsx(['**/*.jsx'], {cwd: cwd, delay: 0});
  });

  it('should hot reload JSX files', (done) => {
    const indexJsx = path.join(rootDir, 'index.jsx');
    const appJsx = path.join(rootDir, 'App.jsx');

    require(indexJsx);

    // our html contains Hello
    expect(getHtmlBody()).toContain('Hello');

    doLater(() => changeFile(appJsx, content => content.replace('Hello', 'Hi')))
      .then(() => waitFor(() => getHtmlBody().match('Hi')))
      .then(done);
  });

  after(() => {
    cleanup();
    delete require.extensions['.jsx'];
    temp.cleanupSync();
  });
});

function waitFor (condition) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const interval = setInterval(() => {
        if (condition()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    }, 0);
  });
}

function doLater (thing) {
  return new Promise((resolve) => {
    setTimeout(() => {
      thing();
      resolve();
    }, 500);
  });
}

function changeFile (filePath, transform) {
  let content = fs.readFileSync(filePath).toString();
  content = transform(content);
  fs.writeFileSync(filePath, content);
}

function getHtmlBody () {
  return document.defaultView.document.documentElement.outerHTML;
}

function createTempJsx (source) {
  let content = fs.readFileSync(require.resolve(source)).toString();

  const reactPath = require.resolve('react').replace(/\\/g, '/');
  content = content.replace("require('react')", `require('${reactPath}')`);

  const reactDOMPath = require.resolve('react-dom').replace(/\\/g, '/');
  content = content.replace("require('react-dom')", `require('${reactDOMPath}')`);

  const sourceFileName = path.basename(source);
  fs.writeFileSync(path.join(rootDir, sourceFileName), content);
}

