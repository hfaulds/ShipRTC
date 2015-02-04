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
  this.addConnectionHandlers(server);
  this.connection = server;
  server.handle("register");
};

ConnectionApiUtils.joinLobby = function(lobbyId) {
  var client = new Client(window.location.origin);
  client.on("connected", function(lobbyId) {
    ConnectionResponseActions.connected(client);
  });
  this.addConnectionHandlers(client);
  this.connection = client;
  client.handle('connectToServer', lobbyId);
};

ConnectionApiUtils.addConnectionHandlers = function(connection) {
  connection.on("close", function(e) {
    ConnectionResponseActions.disconnected(e);
    ConnectionApiUtils.removeConnection(connection);
  });
  connection.on("error", function(e) {
    ConnectionResponseActions.disconnected(e);
    ConnectionApiUtils.removeConnection(connection);
  });
  connection.on("receiveMessage", function(message, sender) {
    ConnectionResponseActions.receiveMessage({
      sender: sender,
      body: message,
    });
  });
};

ConnectionApiUtils.sendMessage = function(message) {
  this.connection.handle("sendMessage", message);
};

ConnectionApiUtils.removeConnection = function() {
  delete this.connection;
};

module.exports = ConnectionApiUtils;
