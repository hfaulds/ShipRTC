var React = require('react');
var alt = require('./alt');

require('./stores/connection_store');
require('./stores/lobby_store');
require('./stores/message_store');
require('./stores/player_store');
require('./stores/game_settings_store');
require('./stores/image_store');

var domNode = document.querySelector("body");
var snapshot = domNode.dataset.snapshot;
alt.bootstrap(snapshot);

var App = require('./components/app.jsx');
React.render(App(), document.querySelector("body"));

var LobbyActions = require('./actions/lobby_actions');
LobbyActions.refreshLobbies();
