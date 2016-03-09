const React = require('react');

module.exports = class Component extends React.Component {
    render() {
        return React.createElement("div", null, "Some text")
    }
};
