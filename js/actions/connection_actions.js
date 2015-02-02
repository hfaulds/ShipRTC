var alt = require('../alt');
var Client = require("../client/client");
var Server = require("../client/server");
var connectionActions;

function ConnectionActions() {
}

ConnectionActions.prototype.createLobby = function(lobbyId) {
  var server = new Server(window.location.origin);
  server.on("registered", function(lobbyId) {
    connectionActions.connected(server);
  });
  server.handle("register");
  this.dispatch();
};

ConnectionActions.prototype.joinLobby = function(lobbyId) {
  var client = new Client(window.location.origin);
  client.on("connected", function() {
    connectionActions.connected(client);
  });
  client.handle('connectToServer', lobbyId);
  this.dispatch();
};

ConnectionActions.prototype.connected = function(connection) {
  this.dispatch(connection);
};

module.exports = connectionActions = alt.createActions(ConnectionActions);
