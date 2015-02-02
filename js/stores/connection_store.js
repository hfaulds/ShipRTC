var alt = require('../alt');
var ConnectionActions = require('../actions/connection_actions');

function ConnectionStore() {
  this.connectionState = ConnectionStore.DISCONNECTED;
  this.bindActions(ConnectionActions);
}

ConnectionStore.DISCONNECTED = 1;
ConnectionStore.CONNECTING = 2;
ConnectionStore.CONNECTED = 3;

ConnectionStore.prototype.onCreateLobby = function() {
  this.connectionState = ConnectionStore.CONNECTING;
};

ConnectionStore.prototype.onJoinLobby = function(lobbyServerURL) {
  this.connectionState = ConnectionStore.CONNECTING;
};

ConnectionStore.prototype.onConnected = function(connection) {
  this.connectionState = ConnectionStore.CONNECTED;
  this.connection = connection;
};

module.exports = alt.createStore(ConnectionStore);
