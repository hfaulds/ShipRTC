var alt = require('../alt');
var connectionStateActions;

function ConnectionStateActions() {
}

ConnectionStateActions.prototype.setLobbyServerURL = function(lobbyServerURL) {
  this.lobbyServerURL = lobbyServerURL;
};

ConnectionStateActions.prototype.createLobby = function(lobbyId) {
  var Server = require("../client/server");
  var server = new Server(this.lobbyServerURL);
  server.on("registered", function(lobbyId) {
    connectionStateActions.connected();
  });
  server.handle("register");
  this.dispatch();
};

ConnectionStateActions.prototype.joinLobby = function(lobbyId) {
  var Client = require("../client/client");
  var client = new Client(this.lobbyServerURL);
  client.on("connected", function() {
    connectionStateActions.connected();
    client.handle('sendMessage', 'client connected');
  });
  client.handle('connectToServer', lobbyId);
  this.dispatch();
};

ConnectionStateActions.prototype.connected = function() {
  this.dispatch();
};

module.exports = connectionStateActions = alt.createActions(ConnectionStateActions);
