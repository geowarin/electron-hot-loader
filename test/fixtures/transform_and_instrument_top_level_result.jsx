var __electronHot__ = require('_electronHotLocation_');
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./ui/App.jsx');

__electronHot__.registerRoot(ReactDOM.render(React.createElement(__electronHot__.register(App, require.resolve('./ui/App.jsx')), null), document.getElementById('root')));