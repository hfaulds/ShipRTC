var Negotiator = require("./negotiator");
var Express = require('express');
var Socket = require('socket.io');

function LobbyServer(port) {
  this.app = Express();
  this.server = require('http').Server(this.app);
  this.io = Socket(this.server);

  this.lobbies = [];
  this.negotiators = [];
  this.port = port;
}

LobbyServer.prototype.listen = function(port) {
  var that = this;
  that.server.listen(port);

  that.app.get('/', function (req, res) {
    res.sendfile('examples.html');
  });

  that.app.get('/js/bundle.js', function (req, res) {
    res.sendfile('bundle.js');
  });

  that.io.on('connection', function(socket) {
    socket.on('registerGameServer', function () {
      var lobbyId = that.lobbies.length;
      that.lobbies[lobbyId] = socket;
      socket.emit('serverRegistered', lobbyId);
    });

    socket.on('joinGameSever', function(lobbyId) {
      var negotiatorId = that.negotiators.length;
      var negotiator = new Negotiator();
      that.negotiators.push(negotiator);

      var lobbySocket = that.lobbies[lobbyId];
      lobbySocket.emit('createConnection', negotiatorId);
      socket.emit('createConnection', negotiatorId);
    });

    socket.on("startNegotiation", function(negotiatorId, id) {
      that.negotiators[negotiatorId].handle("connect", socket, id);
    });

    socket.on("shareOffer", function(negotiatorId, desc) {
      that.negotiators[negotiatorId].handle("shareOffer", desc);
    });

    socket.on("shareAnswer", function(negotiatorId, desc) {
      that.negotiators[negotiatorId].handle("shareAnswer", desc);
    });

    socket.on("acceptAnswer", function(negotiatorId) {
      that.negotiators[negotiatorId].handle("acceptAnswer");
    });

    socket.on("shareIceCandidate", function(negotiatorId, candidate) {
      that.negotiators[negotiatorId].handle("shareIceCandidate", socket, candidate);
    });
  });
};

module.exports = LobbyServer;
