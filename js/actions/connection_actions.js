var alt = require('../alt');

function ConnectionActions() {
}

ConnectionActions.prototype.createLobby = function(lobbyId) {
  this.dispatch(lobbyId);
};

ConnectionActions.prototype.joinLobby = function(lobbyId) {
  this.dispatch(lobbyId);
};

ConnectionActions.prototype.sendMessage = function(message) {
  this.dispatch(message);
};

module.exports = alt.createActions(ConnectionActions);
