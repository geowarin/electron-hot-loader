const React = require('react');
const ReactDOM = require('react-dom');

console.debug = () => {};

const App = require('./App.jsx');
const element = document.createElement('div');
document.body.appendChild(element);
ReactDOM.render(<App/>, element);
