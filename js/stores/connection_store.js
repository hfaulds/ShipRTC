var alt = require('../alt');
var ConnectionActions = require('../actions/connection_actions');
var ConnectionResponseActions = require('../actions/connection_response_actions');

function ConnectionStore() {
  this.connectionState = ConnectionStore.DISCONNECTED;
  this.bindActions(ConnectionActions);
  this.bindActions(ConnectionResponseActions);
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

ConnectionStore.prototype.onDisconnected = function() {
  this.connectionState = ConnectionStore.DISCONNECTED;
};

module.exports = alt.createStore(ConnectionStore);
