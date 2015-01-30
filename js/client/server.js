var Connection = require("./connection");
var _ = require('underscore');
var io = require('socket.io-client');

function Server(lobbyServerUrl) {
  var lobbyServer = io(lobbyServerUrl, {'force new connection': true});
  var connections = [];

  var that = this;
  lobbyServer.on('createConnection', function(negotiatorId) {
    var connectionId = that.connections.length;
    var connection = new Connection(undefined, connectionId, negotiatorId, lobbyServer);
    connection.handle("connect");
    that.connections.push(connection);
  });

  lobbyServer.on('createOffer', function(id) {
    that.connections[id].handle("createOffer");
  });

  lobbyServer.on('receiveOffer', function(id, offer) {
    that.connections[id].handle("receiveOffer", offer);
  });

  lobbyServer.on('acceptAnswer', function(id, answer) {
    that.connections[id].handle("acceptAnswer", answer);
  });

  lobbyServer.on('addIceCandidate', function(id, candidate) {
    that.connections[id].handle("addIceCandidate", candidate);
  });

  this.lobbyServer = lobbyServer;
  this.connections = connections;
}

Server.prototype.register = function(lobbyId) {
  this.lobbyServer.emit('registerGameServer', lobbyId);
};

Server.prototype.sendMessage = function(data) {
  _.each(this.connections, function(connection) {
    connection.handle('sendMessage', data);
  });
};

module.exports = Server;
