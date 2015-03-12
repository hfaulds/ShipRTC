var _ = require('lodash');
var io = require('socket.io-client');
var Machina = require('machina');
if(global.document) var PIXI = require('pixi.js');

var Simulation = require('./simulation');
var ConnectionPool = require('./connection_pool');

module.exports = Machina.Fsm.extend({
  initialState: "unregistered",
  simulation: new Simulation(),

  tick: function() {
    setTimeout(this.tick.bind(this), 10);

    this.simulation.tick();

    var that = this;
    _.each(this.simulation.playerPositions, function(position, id) {
      if(position.dirty) {
        that.handle("sendMessage", {
          type: "movePlayer",
          playerId: id,
          position: position,
        });
        that.emit("movePlayer", {
          playerId: id,
          position: position,
        });
        position.dirty = false;
      }
    });
  },

  setupConnectionPoolSignalHandlers: function(connectionPool, lobbyServer) {
    _.each(['createOffer', 'receiveOffer', 'acceptAnswer', 'addIceCandidate'], function(event) {
      lobbyServer.on(event, connectionPool[event]);
    });
  },

  setupConnectionSignalHandlers: function(connection, lobbyServer) {
    _.each(['startNegotiation', 'shareOffer', 'shareAnswer', 'acceptAnswer', 'shareIceCandidate'], function(event) {
      connection.on(event, function() {
        var args = _.union([event], arguments);
        lobbyServer.emit.apply(lobbyServer, args);
      });
    });
  },

  initialize : function(lobbyServer, connectionPool) {
    connectionPool = connectionPool || new ConnectionPool();

    this.setupConnectionPoolSignalHandlers(connectionPool, lobbyServer);

    var that = this;
    lobbyServer.on('createConnection', function(negotiatorId) {
      var connection = connectionPool.createConnection(negotiatorId, this);
      that.setupConnectionSignalHandlers(connection, lobbyServer);

      connection.on('connected', function(playerId) {
        _.each(that.simulation.playerPositions, function(position, id) {
          connectionPool.sendTo(playerId, {
            type: 'newPlayer',
            playerId: id,
            position: position,
          });
        });

        that.simulation.initPlayer(playerId);
        that.emit("newPlayer", {
          playerId: playerId,
          position: that.simulation.playerPositions[playerId]
        });

        that.connectionPool.sendAll({
          type: 'newPlayer',
          playerId: playerId,
          position: that.simulation.playerPositions[playerId],
        });

        connectionPool.sendTo(playerId, {
          type: 'controlPlayer',
          playerId: playerId
        });
      });

      connection.on('disconnected', function(playerId) {
        connectionPool.sendAll({
          type: 'removePlayer',
          playerId: playerId,
        });
        that.emit('removePlayer', playerId);
        that.simulation.removePlayer(playerId);
      });

      connection.on('receiveMessage', function(connectionId, message) {
        if(message.type == "playerInput") {
          that.simulation.playerInputs[connectionId] = message.input;
        } else {
          that.emit("receiveMessage", message, connectionId);
          connectionPool.sendAllExcept(connectionId, message);
        }
      });
    });

    lobbyServer.on('serverRegistered', function(lobbyId) {
      that.emit("registered", lobbyId);
      that.transition("registered");
      that.emit("newPlayer", {
        playerId: 'server',
        position: that.simulation.playerPositions.server
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
