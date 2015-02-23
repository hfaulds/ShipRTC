var _ = require('lodash');
var io = require('socket.io-client');
var Machina = require('machina');

var Simulation = require('./simulation');
var Connection = require("./connection");

module.exports = Machina.Fsm.extend({
  initialState: "disconnected",
  simulation: new Simulation(),

  tick: function() {
    setTimeout(this.tick.bind(this), 10);
    this.simulation.tick();

    var that = this;

    _.each(this.simulation.playerPositions, function(position, id) {
      if(position.dirty) {
        that.emit("movePlayer", {
          playerId: id,
          position: position,
        });
        position.dirty = false;
      }
    });
  },

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
        if(message.type == 'newPlayer') {
          that.emit("newPlayer", message.playerId);
        } else if(message.type == 'movePlayer') {
          that.emit('movePlayer', message);
          that.simulation.playerPositions[message.playerId] = message.position;
        } else if(message.type == 'controlPlayer') {
          that.playerId = message.playerId;
          that.simulation.playerPositions[message.playerId] = { x: 0, y:0, rotation: 0 };
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
      _onEnter: function() {
        setTimeout(this.tick.bind(this), 10);
      },
      "handleInput" : function(input) {
        this.connection.handle('sendMessage', {
          type: "playerInput",
          input: input,
        });
        if(this.playerId) {
          this.simulation.playerInputs[this.playerId] = input;
        }
      },
      "sendMessage" : function(data) {
        this.connection.handle('sendMessage', data);
      }
    }
  }
});
