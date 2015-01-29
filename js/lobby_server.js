var Negotiator = require("./local_connection_negotiator");
var Express = require('express');
var Socket = require('socket.io');

function LobbyServer(port) {
  this.app = Express();
  this.server = require('http').Server(this.app);

  this.lobbies = [];
  this.negotiators = [];
  this.port = port;
}

LobbyServer.prototype.listen = function(port) {
  var that = this;
  this.io = Socket(that.server);
  that.server.listen(port, function(){
    console.log("Express server listening on port %d", that.server.address().port);
  });
  that.app.get('/', function (req, res) {
    res.sendfile('examples.html');
  });
  that.app.get('/bundle.js', function (req, res) {
    res.sendfile('bundle.js');
  });

  that.io.on('connection', function(socket) {
    socket.on('registerGameServer', function () {
      var lobbyId = that.lobbies.length;
      that.lobbies[lobbyId] = socket;
    });

    socket.on('joinGameSever', function(lobbyId) {
      var negotiatorId = that.negotiators.length;
      var negotiator = new Negotiator(io, negotiatorId);
      that.negotiators.push(negotiator);

      var lobbySocket = that.lobbies[lobbyId];
      lobbySocket.emit('createConnection', negotiatorId);
      socket.emit('createConnection', negotiatorId);
    });


    socket.on("connect", function(negotiatorId, id) {
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

    socket.on("shareIceCandidate", function(negotiatorId, id, candidate) {
      that.negotiators[negotiatorId].handle("shareIceCandidate", socket, candidate);
    });
  });
};

module.exports = LobbyServer;
