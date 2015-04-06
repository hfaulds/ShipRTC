var alt = require('../alt');

var io = require('socket.io-client');
var Client = require("../client/client");
var Server = require("../client/server");

var ConnectionActions = require('../actions/connection_actions');
var ConnectionResponseActions = require('../actions/connection_response_actions');
var InputActions = require('../actions/input_actions');
var GameSettingsActions = require('../actions/game_settings_actions');

function ConnectionStore() {
  this.connectionState = ConnectionStore.DISCONNECTED;
  this.bindActions(ConnectionActions);
  this.bindActions(ConnectionResponseActions);
  this.bindActions(InputActions);
}

ConnectionStore.DISCONNECTED = 1;
ConnectionStore.CONNECTING = 2;
ConnectionStore.CONNECTED = 3;

ConnectionStore.prototype.onCreateLobby = function(lobbyId) {
  this.connectionState = ConnectionStore.CONNECTING;

  var lobbyServer = io(window.location.origin, {'force new connection': true});
  var server = new Server(lobbyServer);
  server.on("registered", function(lobbyId) {
    ConnectionResponseActions.connected(server);
  });
  this.addConnectionHandlers(server);
  this.connection = server;
  server.handle("register");
};

ConnectionStore.prototype.onJoinLobby = function(lobbyId) {
  this.connectionState = ConnectionStore.CONNECTING;

  var lobbyServer = io(window.location.origin, {'force new connection': true});
  var client = new Client(lobbyServer);
  client.on("connected", function(lobbyId) {
    ConnectionResponseActions.connected(client);
  });
  this.addConnectionHandlers(client);
  this.connection = client;
  client.handle('connectToServer', lobbyId);
};

ConnectionStore.prototype.addConnectionHandlers = function(connection) {
  connection.on("disconnected", function(e) {
    ConnectionResponseActions.disconnected(e);
    delete this.connection;
  });
  connection.on("error", function(e) {
    ConnectionResponseActions.disconnected(e);
    delete this.connection;
  });
  connection.on("receiveSnapshot", function(message) {
    ConnectionResponseActions.receiveSnapshot(message.snapshot);
  });
  connection.on("receiveMessage", function(message, sender) {
    ConnectionResponseActions.receiveMessage({
      sender: sender,
      body: message,
    });
  });
};

ConnectionStore.prototype.onConnected = function() {
  this.connectionState = ConnectionStore.CONNECTED;
};

ConnectionStore.prototype.onDisconnected = function() {
  this.connectionState = ConnectionStore.DISCONNECTED;
};

ConnectionStore.prototype.onSendMessage = function(message) {
  this.connection.handle("sendMessage", message);
};

ConnectionStore.prototype.onHandleInput = function(input) {
  this.connection.handle("handleInput", input);
};

ConnectionStore.prototype.onInputChange = function(input) {
  this.connection.handle("handleInput", input);
};

ConnectionStore.prototype.onSetSimulatedLatency = function(latency) {
  this.connection.setSimulatedLatency(latency);
};

ConnectionStore.prototype.onSetSimulatedPacketLoss = function(packetLoss) {
  this.connection.setSimulatedPacketLoss(packetLoss);
};

ConnectionStore.prototype.onToggleClientPrediction = function(toggle) {
  this.connection.toggleClientPrediction(toggle);
};

module.exports = alt.createStore(ConnectionStore, 'ConnectionStore');
