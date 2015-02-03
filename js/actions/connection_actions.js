var alt = require('../alt');
var ConnectionApiUtils = require('../utils/connection_api_utils');

function ConnectionActions() {
}

ConnectionActions.prototype.createLobby = function(lobbyId) {
  this.dispatch();
  ConnectionApiUtils.createLobby();
};

ConnectionActions.prototype.joinLobby = function(lobbyId) {
  this.dispatch();
  ConnectionApiUtils.joinLobby(lobbyId);
};

ConnectionActions.prototype.sendMessage = function(message) {
  this.dispatch(message);
  ConnectionApiUtils.sendMessage(message);
};

module.exports = alt.createActions(ConnectionActions);
