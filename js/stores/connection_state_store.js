var alt = require('../alt');
var ConnectionStateActions = require('../actions/connection_state_actions');

function ConnectionStateStore() {
  this.connectionState = ConnectionStateStore.DISCONNECTED;
  this.bindActions(ConnectionStateActions);
}

ConnectionStateStore.DISCONNECTED = 1;
ConnectionStateStore.CONNECTING = 2;
ConnectionStateStore.CONNECTED = 3;

ConnectionStateStore.prototype.onCreateLobby = function() {
  this.connectionState = ConnectionStateStore.CONNECTING;
};

ConnectionStateStore.prototype.onJoinLobby = function(lobbyServerURL) {
  this.connectionState = ConnectionStateStore.CONNECTING;
};

ConnectionStateStore.prototype.onConnected = function() {
  this.connectionState = ConnectionStateStore.CONNECTED;
};

module.exports = alt.createStore(ConnectionStateStore);
