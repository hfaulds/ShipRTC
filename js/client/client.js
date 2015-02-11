var Connection = require("./connection");
var io = require('socket.io-client');
var Machina = require('machina');

module.exports = Machina.Fsm.extend({
  initialState: "disconnected",

  initialize : function(lobbyServerUrl) {
    var lobbyServer = io(lobbyServerUrl, {'force new connection': true});
    var that = this;
    lobbyServer.on('createConnection', function(negotiatorId, connectionName) {
      that.connection = new Connection(undefined, 9, negotiatorId, lobbyServer);
      that.connection.on("connected", function() {
        that.transition("connected");
        that.emit("connected");
      });
      that.connection.on("close", function(e) {
        that.emit("close");
      });
      that.connection.on("error", function(e) {
        that.emit("error");
      });
      that.connection.on("receiveMessage", function(message) {
        if(message == 'newPlayer') {
          that.emit("newPlayer");
        } else {
          that.emit("receiveMessage", message, connectionName);
        }
      });
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
  },

  states : {
    "disconnected" : {
      "connectToServer" : function(lobbyId) {
        this.lobbyServer.emit('joinGameSever', lobbyId);
      },
      "sendMessage" : function() {
        this.deferUntilTransition("connected");
      }
    },
    "connected" : {
      "sendMessage" : function(data) {
        this.connection.handle('sendMessage', data);
      }
    }
  }
});
