var alt = require('../alt');
var LobbyActions = require('../actions/lobby_actions');

function ConnectionResponseActions() {
  this.generateActions('connected', 'receiveMessage', 'newPlayer', 'movePlayer');
}

ConnectionResponseActions.prototype.disconnected = function() {
  this.dispatch();
  LobbyActions.refreshLobbies();
};

module.exports = alt.createActions(ConnectionResponseActions);
