var Connection = require("./connection");

function Client(lobbyServer) {
  this.lobbyServer = lobbyServer;
}

Client.prototype.connectToServer = function(lobbyId) {
  this.lobbyServer.joinGameSever(lobbyId, this);
};

Client.prototype.createConnection =  function(negotiator) {
  this.connection = new Connection(0, negotiator);
  this.connection.handle("connect");
  return 0;
};

Client.prototype.createOffer = function(id) {
  this.connection.handle("createOffer");
};

Client.prototype.receiveOffer = function(id, offer) {
  this.connection.handle("receiveOffer", offer);
};

Client.prototype.acceptAnswer = function(id, answer) {
  this.connection.handle("acceptAnswer", answer);
};

Client.prototype.addIceCandidate = function(id, candidate) {
  this.connection.handle("addIceCandidate", candidate);
};

Client.prototype.sendMessage = function(data) {
  this.connection.handle('sendMessage', data);
};

module.exports = Client;
