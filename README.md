# Electron-hot-loader

[![npm](https://img.shields.io/npm/v/electron-hot-loader.svg)](https://www.npmjs.com/package/electron-hot-loader)
[![Build Status](https://travis-ci.org/geowarin/electron-hot-loader.svg?branch=master)](https://travis-ci.org/geowarin/electron-hot-loader)
[![Build status](https://ci.appveyor.com/api/projects/status/29rs2pt350ravclk?svg=true)](https://ci.appveyor.com/project/geowarin/electron-hot-loader)

Hot reloading for React components in electron without babel nor webpack

This package leverages `react-proxy` and electron's access to the file system to enable
hot reloading on React components at really high speed.

![Demo of electron-hot-boilerplate](http://i.imgur.com/soKDmIq.gif)

Demo: [electron-hot-boilerplate](https://github.com/geowarin/electron-hot-boilerplate)

## Setup

Put the following code at the top of `index.js`, the javascript entry point of your application in the browser.
It is generally included in your `index.html`.

```js
if (process.env.NODE_ENV === 'development') {
    const electronHot = require('electron-hot-loader');
    electronHot.install();
    electronHot.watchJsx(['src/**/*.jsx']);
    electronHot.watchCss(['src/assets/**/*.css']);
}

// We can now require our jsx files, they will be compiled for us
require('./index.jsx');

// In production you should not rely on the auto-transform.
// Pre-compile your react components with your build system instead.

// But, you can do this if your really want to:
// require('electron-hot-loader').install({doNotInstrument: true});

```

The `index.jsx` file is just the classic React initialization:

```jsx
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./ui/App.jsx');

ReactDOM.render(<App/>, document.getElementById('root'));
```

`electron-hot-loader` will instrument all your React components and wrap them in proxies.
When a file is updated on your disk, the proxies will update and a render will be forced on the
root component.

This is very similar to what `react-transform-hmr` does but without dependencies to babel or webpack.

For your tests you can add this to your mocha config, it will compile your jsx without instrumenting them:

```
-u bdd
--recursive ./test/**/*.jsx
--full-trace
--reporter spec
--require electron-hot-loader/compiler
```

## Higher order components

A [higher order component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.r6nqzwnwc)
is a function that takes a component and returns another, decorated, component.

Some libraries (like Redux with `connect`) use higher-order components.
With only access to the AST, it is impossible to find out if a function will return a component
or not.

So you will need to explicitly register the names of the higher order components when installing
`electron-hot-loader`:

```js
electronHot.install({higherOrderFunctions: ['connect']});
```

A demo of electron-hot-loader working with redux is available [on the redux branch](https://github.com/geowarin/electron-hot-boilerplate#redux) of electron-hot-boilerplate.

## Goal

Since electron is both node and a browser, I figured we could try experimenting hot reloading without webpack
in this context.

In its latest versions, node has access to a lot of [ES2015 features](https://nodejs.org/en/docs/es6/#ref-1). There seems to be
little need for a babel transpilation... If you can live with the lack of es6 modules and spread operators!

In exchange, you will get a much better developer experience. Not much overhead or config and very fast reloads.
Also, as soon as those features land in V8, we'll get them for free!

## Principle

Installing `electron-hot-loader` will use [require extensions](https://nodejs.org/api/globals.html#globals_require_extensions)
(don't pay attention to the deprecation warning, it's just for development, right?) to compile JSX files as your `require`
them in your application.

Since we have access to all the compiled components, we can use `esprima` to get the AST of each one.

The `ReactDOM.render` method has a distinctive signature that we can use to identify the root of our application.

When a user component is included in a JSX file, it is compiled to `React.createElement()`.
We can wrap all those calls in a `register()` method, keep track of all the components created that way, and wrap them with `react-proxy`.

Then, it is just a matter of watching the file system to know which components have been updated and force a re-render
on them.

The application will keep all its state and you will get unprecedented productivity.

## Disclaimer

This is still a POC.
I plan to use it in my current project where I was a little upset with the overhead of using webpack
in electron so I will be the first to eat my own dog food.

Critiques and ideas are warmly welcomed so do not hesitate to open issues and sumit pull requests.

## Roadmap

- [x] Write some tests
- [ ] Write some more tests
- [ ] Welcome feedback and ideas
- [x] Support source maps

## Example

Have a look at [electron-hot-boilerplate](https://github.com/geowarin/electron-hot-boilerplate) for a complete example.

## Thanks

Dan Abramov and the [other commiters](https://github.com/gaearon/react-proxy/graphs/contributors) for their incredible work on [react-proxy](https://github.com/gaearon/react-proxy/).

[Gurdas Nijor](https://github.com/gurdasnijor) for his [inspirational talk](https://www.youtube.com/watch?v=OZGgVxFxSIs) at ReactJS 2015 and his [repo](https://github.com/gurdasnijor/component-flow-loader) demonstrating esprima tranforms for React.
