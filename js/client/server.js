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

    this.connectionPool.each(function(connection, playerId) {
      var snapshot = _.clone(this.simulation.playerPositions);
      snapshot.self = snapshot[playerId];
      delete snapshot[playerId];

      connection.handle('sendMessage', {
        type: 'snapshot',
        snapshot: snapshot,
        snapshotId: this.snapshotIds[playerId],
      });
    }.bind(this));
  },

  initialize : function(lobbyServer, connectionPool) {
    var that = this;
    this.snapshotIds = {};

    var localConnection = {
      handle: function(id, message) {
        var event = 'receive' + _.capitalize(message.type);
        that.emit(event, message);
      }
    };
    connectionPool = connectionPool || new ConnectionPool({ server: localConnection }, lobbyServer);

    lobbyServer.on('createConnection', function(negotiatorId) {
      var connection = connectionPool.createConnection(negotiatorId, this);

      connection.on('connected', function() {
        that.simulation.initPlayer(connection.id);
      });

      connection.on('disconnected', function() {
        that.simulation.removePlayer(connection.id);
      });

      connection.on('receiveMessage', function(message) {
        if(message.type == "playerInput") {
          that.simulation.playerInputs[connection.id] = message.input;
          that.snapshotIds[connection.id] = message.snapshotId;
        } else {
          connectionPool.sendAllExcept(connection.id, message);
        }
      });
    });

    lobbyServer.on('serverRegistered', function(lobbyId) {
      that.emit("registered", lobbyId);
      that.transition("registered");
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
