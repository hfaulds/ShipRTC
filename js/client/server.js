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

  initialize : function(lobbyServerUrl) {
    var lobbyServer = io(lobbyServerUrl, {'force new connection': true});
    var connectionPool = new ConnectionPool(lobbyServer);

    var that = this;
    lobbyServer.on('serverRegistered', function(lobbyId) {
      that.emit("registered", lobbyId);
      that.transition("registered");
      that.emit("newPlayer", 'server');
    });

    connectionPool.on('addingClientToPool', function(connectionId) {
      that.simulation.playerPositions[connectionId] = { x: 0, y:0, rotation: 0 };
      that.emit("newPlayer", connectionId);
      connectionPool.sendAll({
        type: 'newPlayer',
        playerId: connectionId
      });
    });

    connectionPool.on('addedClientToPool', function(connectionId) {
      _.each(that.simulation.playerPositions, function(position, id) {
        connectionPool.sendTo(connectionId, {
          type: 'newPlayer',
          playerId: id
        });
      });
    });

    connectionPool.on('receiveMessage', function(connectionId, message) {
      if(message.type == "playerInput") {
        that.simulation.playerInputs[connectionId] = message.input;
      } else {
        that.emit("receiveMessage", message, connectionId);
        connectionPool.sendAllExcept(connectionId, message);
      }
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
