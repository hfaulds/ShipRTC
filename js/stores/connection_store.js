var alt = require('../alt');
var ConnectionActions = require('../actions/connection_actions');

function ConnectionStore() {
  this.connectionState = ConnectionStore.DISCONNECTED;
  this.bindAction(ConnectionActions.createLobby, this.onCreateLobby);
  this.bindAction(ConnectionActions.joinLobby, this.onJoinLobby);
  this.bindAction(ConnectionActions.connected, this.onConnected);
}

ConnectionStore.DISCONNECTED = 1;
ConnectionStore.CONNECTING = 2;
ConnectionStore.CONNECTED = 3;

ConnectionStore.prototype.onCreateLobby = function() {
  this.connectionState = ConnectionStore.CONNECTING;
};

ConnectionStore.prototype.onJoinLobby = function() {
  this.connectionState = ConnectionStore.CONNECTING;
};

ConnectionStore.prototype.onConnected = function() {
  this.connectionState = ConnectionStore.CONNECTED;
};

module.exports = alt.createStore(ConnectionStore);
