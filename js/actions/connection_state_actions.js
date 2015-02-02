var alt = require('../alt');
var Client = require("../client/client");
var Server = require("../client/server");
var connectionStateActions;

function ConnectionStateActions() {
}

ConnectionStateActions.prototype.createLobby = function(lobbyId) {
  var server = new Server(window.location.origin);
  server.on("registered", function(lobbyId) {
    connectionStateActions.connected();
  });
  server.handle("register");
  this.dispatch();
};

ConnectionStateActions.prototype.joinLobby = function(lobbyId) {
  var client = new Client(window.location.origin);
  client.on("connected", function() {
    connectionStateActions.connected();
  });
  client.handle('connectToServer', lobbyId);
  this.dispatch();
};

ConnectionStateActions.prototype.connected = function() {
  this.dispatch();
};

module.exports = connectionStateActions = alt.createActions(ConnectionStateActions);
