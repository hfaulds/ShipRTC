var Connection = require("./connection");
var _ = require('lodash');
var io = require('socket.io-client');
var Machina = require('machina');
if(global.document) {
  var PIXI = require('pixi.js');
}

module.exports = Machina.Fsm.extend({
  initialState: "unregistered",

  playerPositions: {
    'server' : { x: 0, y:0, rotation: 0 }
  },
  playerInputs: {},

  tick: function() {
    window.requestAnimationFrame(this.tick.bind(this));

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
    var connections = [];

    var that = this;
    lobbyServer.on('serverRegistered', function(lobbyId) {
      that.emit("registered", lobbyId);
      that.transition("registered");
      that.emit("newPlayer", 'server');
    });

    lobbyServer.on('createConnection', function(negotiatorId, connectionName) {
      var connectionId = that.connections.length;
      var connection = new Connection(undefined, connectionId, negotiatorId, lobbyServer);
      connection.on("connected", function() {
        that.playerPositions[connection.id] = { x: 0, y:0, rotation: 0 };
        that.emit("newPlayer", connection.id);
        _.each(_.without(connections, connection), function(con) {
          con.handle('sendMessage', {type: 'newPlayer', playerId: connection.id});
        });
        _.each(that.playerPositions, function(position, id) {
          connection.handle('sendMessage', {type: 'newPlayer', playerId: id});
        });
      });
      connection.on("receiveMessage", function(message) {
        if(message.type == "playerInput") {
          that.playerInputs[connection.id] = message.input;
        } else {
          that.emit("receiveMessage", message, connectionName);
          _.each(_.without(connections, connection), function(con) {
            con.handle('sendMessage', message);
          });
        }
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
      _onEnter: function() {
        window.requestAnimationFrame(this.tick.bind(this));
      },
      "handleInput" : function(input) {
        this.playerInputs.server = input;
      },
      "sendMessage" : function(data) {
        _.each(this.connections, function(connection) {
          connection.handle('sendMessage', data);
        });
      }
    }
  }
});
