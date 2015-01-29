var Connection = require("./connection");
var io = require('socket.io-client');

function Client(lobbyServerUrl) {
  var lobbyServer = io(lobbyServerUrl);

  var that = this;
  lobbyServer.on('createConnection', function(negotiatorId) {
    that.connection = new Connection(0, negotiatorId, this.lobbyServer);
    that.connection.handle("connect");
  });

  lobbyServer.on('createOffer', function(id) {
    that.connection.handle("createOffer");
  });

  lobbyServer.on('receiveOffer', function(id, offer) {
    that.connection.handle("receiveOffer", offer);
  });

  lobbyServer.on('acceptAnswer', function(id, answer) {
    that.connection.handle("acceptAnswer", answer);
  });

  lobbyServer.on('addIceCandidate', function(id, candidate) {
    that.connection.handle("addIceCandidate", candidate);
  });

  this.lobbyServer = lobbyServer;
}

Client.prototype.connectToServer = function(lobbyId) {
  this.lobbyServer.emit('joinGameSever', lobbyId);
};

Client.prototype.sendMessage = function(data) {
  if(this.connection) {
    this.connection.handle('sendMessage', data);
  }
};

module.exports = Client;
