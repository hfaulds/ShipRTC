var _ = require('lodash');
var Machina = require('machina');

var Simulation = require('./simulation');
var ConnectionPool = require('./connection_pool');

module.exports = Machina.Fsm.extend({
  initialState: "unregistered",
  simulation: new Simulation(),

  tick: function() {
    setTimeout(this.tick.bind(this), 10);

    this.simulation.tick();

    var message = {
      type: "snapshot",
      snapshot: _.clone(this.simulation.playerPositions)
    };
    this.connectionPool.sendAll(message);
    this.emit("receiveSnapshot", message);
  },

  initialize : function(lobbyServer, connectionPool) {
    connectionPool = connectionPool || new ConnectionPool({}, lobbyServer);

    var that = this;
    lobbyServer.on('createConnection', function(negotiatorId) {
      var connection = connectionPool.createConnection(negotiatorId, this);

      connection.on('connected', function() {
        that.simulation.initPlayer(connection.id);
      });

      connection.on('disconnected', function(playerId) {
        connectionPool.sendAll({
          type: 'removePlayer',
          playerId: playerId,
        });
        that.emit('removePlayer', playerId);
        that.simulation.removePlayer(playerId);
      });

      connection.on('receiveMessage', function(message) {
        if(message.type == "playerInput") {
          that.simulation.playerInputs[connection.id] = message.input;
        } else {
          that.emit("receiveMessage", message, connectionId);
          connectionPool.sendAllExcept(connection.id, message);
        }
      });
    });

    lobbyServer.on('serverRegistered', function(lobbyId) {
      that.emit("registered", lobbyId);
      that.transition("registered");
      that.emit("snapshot", {
        snapshot: that.simulation.playerPositions
      });
    });

    this.lobbyServer = lobbyServer;
    this.connectionPool = connectionPool;
  },

  states : {
    "unregistered" : {
      "register" : function() {
        this.lobbyServer.emit('registerGameServer');
      }
    },
    "registered" : {
      _onEnter: function() {
        setTimeout(this.tick.bind(this), 10);
      },
      "handleInput" : function(input) {
        this.simulation.playerInputs.server = input;
      },
      "sendMessage" : function(data) {
        this.connectionPool.sendAll(data);
      }
    }
  }
});
