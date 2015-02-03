var Connection = require("./connection");
var _ = require('lodash');
var io = require('socket.io-client');
var Machina = require('machina');

module.exports = Machina.Fsm.extend({
  initialState: "unregistered",

  initialize : function(lobbyServerUrl) {
    var lobbyServer = io(lobbyServerUrl, {'force new connection': true});
    var connections = [];

    var that = this;
    lobbyServer.on('serverRegistered', function(lobbyId) {
      that.emit("registered", lobbyId);
      that.transition("registered");
    });

    lobbyServer.on('createConnection', function(negotiatorId) {
      var connectionId = that.connections.length;
      var connection = new Connection(undefined, connectionId, negotiatorId, lobbyServer);
      connection.on("receiveMessage", function(message) {
        that.emit("receiveMessage", message);
      });
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
  },

  states : {
    "unregistered" : {
      "register" : function() {
        this.lobbyServer.emit('registerGameServer');
      }
    },
    "registered" : {
      "sendMessage" : function(data) {
        _.each(this.connections, function(connection) {
          connection.handle('sendMessage', data);
        });
      }
    }
  }
});
