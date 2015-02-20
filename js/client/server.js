var _ = require('lodash');
var io = require('socket.io-client');
var Machina = require('machina');
if(global.document) var PIXI = require('pixi.js');

var ConnectionPool = require('./connection_pool');

module.exports = Machina.Fsm.extend({
  initialState: "unregistered",

  playerPositions: {
    'server' : { x: 0, y:0, rotation: 0 }
  },
  playerInputs: {},

  tick: function() {
    setTimeout(this.tick.bind(this), 10);

    var that = this;
    _.each(this.playerInputs, function(input, id) {
      var position = that.playerPositions[id];

      if(input.forward && input.forward !== 0) {
        var movementDirection = new PIXI.Matrix();
        movementDirection.translate(0, input.forward * 5);
        movementDirection.rotate(position.rotation);

        var movement = movementDirection.apply(new PIXI.Point());
        position.x += movement.x;
        position.y += movement.y;
        position.dirty = true;
      }

      if(input.rotation && input.rotation !== 0) {
        position.rotation += input.rotation * Math.PI / 64;
        position.dirty = true;
      }

      that.playerPositions[id] = position;
    });

    _.each(this.playerPositions, function(position, id) {
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
      that.playerPositions[connectionId] = { x: 0, y:0, rotation: 0 };
      that.emit("newPlayer", connectionId);
      connectionPool.sendAll({
        type: 'newPlayer',
        playerId: connectionId
      });
    });

    connectionPool.on('addedClientToPool', function(connectionId) {
      _.each(that.playerPositions, function(position, id) {
        connectionPool.sendTo(connectionId, {
          type: 'newPlayer',
          playerId: id
        });
      });
    });

    connectionPool.on('receiveMessage', function(connectionId, message) {
      if(message.type == "playerInput") {
        that.playerInputs[connectionId] = message.input;
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
        this.playerInputs.server = input;
      },
      "sendMessage" : function(data) {
        this.connectionPool.sendAll(data);
      }
    }
  }
});
