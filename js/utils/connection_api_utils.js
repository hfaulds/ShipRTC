var ConnectionResponseActions = require('../actions/connection_response_actions');
var io = require('socket.io-client');
var Client = require("../client/client");
var Server = require("../client/server");

function ConnectionApiUtils() {
}

ConnectionApiUtils.createLobby = function() {
  var lobbyServer = io(window.location.origin, {'force new connection': true});
  var server = new Server(lobbyServer);
  server.on("registered", function(lobbyId) {
    ConnectionResponseActions.connected(server);
  });
  this.addConnectionHandlers(server);
  this.connection = server;
  server.handle("register");
};

ConnectionApiUtils.joinLobby = function(lobbyId) {
  var lobbyServer = io(window.location.origin, {'force new connection': true});
  var client = new Client(lobbyServer);
  client.on("connected", function(lobbyId) {
    ConnectionResponseActions.connected(client);
  });
  this.addConnectionHandlers(client);
  this.connection = client;
  client.handle('connectToServer', lobbyId);
};

ConnectionApiUtils.setSimulatedLatency = function(latency) {
  this.connection.setSimulatedLatency(latency);
};

ConnectionApiUtils.setSimulatedPacketLoss = function(packetLoss) {
  this.connection.setSimulatedPacketLoss(packetLoss);
};

ConnectionApiUtils.toggleClientPrediction = function(toggle) {
  this.connection.toggleClientPrediction(toggle);
};

ConnectionApiUtils.addConnectionHandlers = function(connection) {
  connection.on("disconnected", function(e) {
    ConnectionResponseActions.disconnected(e);
    ConnectionApiUtils.removeConnection(connection);
  });
  connection.on("error", function(e) {
    ConnectionResponseActions.disconnected(e);
    ConnectionApiUtils.removeConnection(connection);
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

ConnectionApiUtils.handleInput = function(input) {
  this.connection.handle("handleInput", input);
};

ConnectionApiUtils.sendMessage = function(message) {
  this.connection.handle("sendMessage", message);
};

ConnectionApiUtils.removeConnection = function() {
  delete this.connection;
};

module.exports = ConnectionApiUtils;
