var ConnectionResponseActions = require('../actions/connection_response_actions');
var Client = require("../client/client");
var Server = require("../client/server");

function ConnectionApiUtils() {
}

ConnectionApiUtils.createLobby = function() {
  var server = new Server(window.location.origin);
  server.on("registered", function(lobbyId) {
    ConnectionResponseActions.connected(server);
  });
  server.on("receiveMessage", function(message) {
    ConnectionResponseActions.receiveMessage(message);
  });
  this.connection = server;
  server.handle("register");
};

ConnectionApiUtils.joinLobby = function(lobbyId) {
  var client = new Client(window.location.origin);
  client.on("connected", function() {
    ConnectionResponseActions.connected(client);
  });
  client.on("receiveMessage", function(message) {
    ConnectionResponseActions.receiveMessage(message);
  });
  this.connection = client;
  client.handle('connectToServer', lobbyId);
};

ConnectionApiUtils.sendMessage = function(message) {
  this.connection.handle("sendMessage", message);
};

module.exports = ConnectionApiUtils;
