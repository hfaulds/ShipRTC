var Negotiator = require("./local_connection_negotiator");

function LobbyServer() {
  this.lobbies = [];
}

LobbyServer.prototype.registerGameServer = function(server) {
  var lobbyId = this.lobbies.length;
  this.lobbies[lobbyId] = server;
  return lobbyId;
};

LobbyServer.prototype.joinGameSever = function(lobbyId, client) {
  var negotiator = new Negotiator();
  // Negotiator will have to talk to Server and Client, not Connection
  var serverCon = this.lobbies[lobbyId].createConnection(negotiator);
  var clientCon = client.createConnection(negotiator);
};

module.exports = LobbyServer;
