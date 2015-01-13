var Connection = require("./connection");
var _ = require('underscore');

function Server(lobbyServer) {
  this.lobbyServer = lobbyServer;
  this.connections = [];
}

Server.prototype.register = function() {
  this.lobbyId = this.lobbyServer.registerGameServer(this);
  return this;
};

Server.prototype.createConnection =  function(negotiator) {
  var connectionId = this.connections.length;
  var connection = new Connection(connectionId, negotiator);
  connection.handle("connect");
  this.connections.push(connection);
  return connectionId;
};

Server.prototype.createOffer = function(id) {
  this.connections[id].handle("createOffer");
};

Server.prototype.receiveOffer = function(id, offer) {
  this.connections[id].handle("receiveOffer", offer);
};

Server.prototype.acceptAnswer = function(id, answer) {
  this.connections[id].handle("acceptAnswer", answer);
};

Server.prototype.addIceCandidate = function(id, candidate) {
  this.connections[id].handle("addIceCandidate", candidate);
};

Server.prototype.sendMessage = function(data) {
  _.each(this.connections, function(connection) {
    connection.handle('sendMessage', data);
  });
};

module.exports = Server;
