var React = require('react');
var App = require('./components/app.jsx');
React.render(App(), document.querySelector("html"));

var LobbyActions = require('./actions/lobby_actions');
LobbyActions.refreshLobbies();
