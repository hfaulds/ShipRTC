var _ = require('lodash');
var Machina = require('machina');

var Negotiator = require("./negotiator");
var Simulation = require('./simulation');
var Connection = require("./connection");

module.exports = Machina.Fsm.extend({
  initialState: "disconnected",

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

  initialize : function(lobbyServer, simulation) {
    this.simulation = simulation || new Simulation();

    var that = this;
    lobbyServer.on('createConnection', function(negotiatorId, connectionName) {
      var negotiator = new Negotiator(lobbyServer, negotiatorId);
      that.connection = new Connection(negotiator);

      that.connection.on("connected", function() {
        that.transition("connected");
        that.emit("connected");
      });
      that.connection.on("disconnected", function() {
        that.emit("disconnected");
      });
      that.connection.on("error", function() {
        that.emit("error");
      });
      that.connection.on("receiveMessage", function(message) {
        if(message.type == 'newPlayer') {
          that.emit("newPlayer", message);
        } else if(message.type == 'movePlayer') {
          if(
            message.playerId !== that.playerId ||
            that.simulation.movePlayer(message.playerId, message.position)
          ) {
            that.emit('movePlayer', message);
          }
        } else if(message.type == 'removePlayer') {
          that.simulation.removePlayer(message.playerId);
          that.emit('removePlayer', message.playerId);
        } else if(message.type == 'controlPlayer') {
          that.playerId = message.playerId;
          that.simulation.initPlayer(message.playerId);
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
