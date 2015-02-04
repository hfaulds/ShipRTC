var Negotiator = require("./negotiator");
var Express = require('express');
var Socket = require('socket.io');
var _ = require('lodash');

require('node-jsx').install({extension: '.jsx'});
React = require('react');
var App = require('../components/app');
function LobbyServer(port) {
  this.app = Express();
  this.server = require('http').Server(this.app);
  this.io = Socket(this.server);

  this.lobbies = {};
  this.negotiators = [];
  this.port = port;
}

LobbyServer.prototype.listen = function(port) {
  var that = this;
  that.server.listen(port);

  that.app.use('/', Express.static(__dirname + '/../../public'));

  that.app.get('/', function (req, res) {
    res.send(
      React.renderToString(App({
        lobbyServerUrl: "http://localhost:9999",
        lobbies: _.keys(that.lobbies),
      }))
    );
  });

  that.app.get('/lobbies', function (req, res) {
    res.send(JSON.stringify(
      _.keys(that.lobbies)
    ));
  });

  that.io.on('connection', function(socket) {
    socket.on('registerGameServer', function () {
      var lobbyId = socket.id;
      that.lobbies[lobbyId] = socket;
      socket.emit('serverRegistered', lobbyId);
    });

    socket.on('joinGameSever', function(lobbyId) {
      var lobbySocket = that.lobbies[lobbyId];
      if(lobbySocket) {
        var negotiatorId = that.negotiators.length;
        var negotiator = new Negotiator();
        that.negotiators.push(negotiator);

        lobbySocket.emit('createConnection', negotiatorId, socket.id);
        socket.emit('createConnection', negotiatorId, lobbySocket.id);
      }
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

    socket.on('disconnect', function() {
      delete that.lobbies[socket.id];
    });
  });
};

module.exports = LobbyServer;
