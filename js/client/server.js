var _ = require('lodash');
var Machina = require('machina');

var Simulation = require('./simulation');
var ConnectionPool = require('./connection_pool');


module.exports = Machina.Fsm.extend({
  initialState: "unregistered",

  simulation: new Simulation(),
  id: 'self',
  remoteInputs: [],

  tickRate: 16,
  physicsTimeStep: 10,

  initialize : function(lobbyServer, connectionPool) {
    this.snapshotIds = {};
    this.lobbyServer = lobbyServer;
    this.connectionPool = connectionPool;
  },

  tick: function() {
    setTimeout(this.tick.bind(this), this.tickRate);
    var realTime = window.performance.now();

    var localInput = this.getLocalInput(realTime);
    var inputs = this.getNetworkInputs();
    inputs.push(localInput);

    var inputsForTimeSlice = function(input) {
      return input.dt >= (realTime - this.simulationTime);
    }.bind(this);

    while (this.simulationTime < realTime) {
      this.simulation.applyInputs(
        this.physicsTimeStep,
        _.select(inputs, inputsForTimeSlice)
      );
      this.simulationTime += this.physicsTimeStep;
    }

    this.sendSnapshots(this.simulation);

    this.renderWorld(this.simulation);
  },

  getNetworkInputs: function() {
    return [];
  },

  getLocalInput: function(realTime) {
    return _.merge(this.input, {dt: realTime, id: this.id});
  },

  sendSnapshots: function(world) {
  },

  renderWorld: function(world) {
    this.emit('receiveSnapshot', { snapshot: world.playerPositions()});
  },

  setSimulatedLatency : function(latency) {
    _.each(this.connectionPool.connections, function(connection) {
      connection.setSimulatedLatency(latency);
    });
  },

  setSimulatedPacketLoss : function(packetLoss) {
    _.each(this.connectionPool.connections, function(connection) {
      connection.setSimulatedPacketLoss(packetLoss);
    });
  },

  toggleClientPrediction : function() {},

  states : {
    "unregistered" : {
      _onEnter: function() {
        var that = this;
        this.lobbyServer.on('serverRegistered', function(lobbyId) {
          that.emit("registered", lobbyId);
          that.transition("registered");
        });
      },
      "register" : function() {
        this.lobbyServer.emit('registerGameServer');
      }
    },
    "registered" : {
      _onEnter: function() {
        var that = this;
        this.lobbyServer.on('createConnection', function(negotiatorId) {
          var connection = connectionPool.createConnection(negotiatorId, this);

          connection.on('connected', function() {
            that.simulation.initPlayer(connection.id);
          });

          connection.on('disconnected', function() {
            that.simulation.removePlayer(connection.id);
          });

          connection.on('receiveMessage', function(message) {
            if(message.type == "playerInput") {
              that.remoteInputs.push(
                _.merge(message.input, {id: connection.id})
              );
            }
          });
        });

        this.input = {};
        this.simulationTime = window.performance.now();
        this.simulation.initPlayer(this.id);
        setTimeout(this.tick.bind(this), this.tickRate);
      },
      "handleInput" : function(input) {
        this.input = input;
      }
    }
  }
});
