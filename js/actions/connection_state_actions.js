var alt = require('../alt');

function ConnectionStateActions() {
}

ConnectionStateActions.prototype.setLobbyServerURL = function(lobbyServerURL) {
  this.lobbyServerURL = lobbyServerURL;
};

ConnectionStateActions.prototype.createLobby = function(lobbyId) {
  var Server = require("../client/server");
  var server = new Server(this.lobbyServerURL);
  server.on("registered", function(lobbyId) {
    var connectionStateActions = require('./connection_state_actions');
    connectionStateActions.connected();
  });
  server.handle("register");
  this.dispatch();
};

ConnectionStateActions.prototype.joinLobby = function(lobbyId) {
  var Client = require("../client/client");
  var client = new Client(this.lobbyServerURL);
  client.on("connected", function() {
    var connectionStateActions = require('./connection_state_actions');
    connectionStateActions.connected();
    client.handle('sendMessage', 'client connected');
  });
  client.handle('connectToServer', lobbyId);
  this.dispatch();
};

ConnectionStateActions.prototype.connected = function() {
  this.dispatch();
};

module.exports = alt.createActions(ConnectionStateActions);
