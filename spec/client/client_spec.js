var _ = require("lodash");

var EventEmitter = require('events').EventEmitter;
var Simulation = require('../../js/client/simulation');
var Client = require("../../js/client/client");

describe("Client", function() {
  var fakeLobbyServer;
  var simulation;
  var client;

  beforeEach(function() {
    fakeLobbyServer = new EventEmitter();
    simulation = new Simulation();
    client = new Client(fakeLobbyServer, simulation);

    fakeLobbyServer.emit('createConnection', 1);
  });

  describe("connection lifecycle", function() {
    describe("on connected", function() {
      it("tells the client it is connected", function() {
        spyOn(client, 'emit');
        client.connection.emit('connected');
        expect(client.emit).toHaveBeenCalledWith("connected");
      });
    });

    describe("on message", function() {
      it("adds player input to the simulation", function() {
      });

      it("handles player messages", function() {
      });
    });

    describe("on disconnected", function() {
      it("tells the client it is disconnected", function() {
        spyOn(client, 'emit');
        client.connection.emit('disconnected');
        expect(client.emit).toHaveBeenCalledWith("disconnected");
      });
    });
  });

  describe("handleInput", function() {
    var input = 'foo';

    beforeEach(function() {
      client.connection.emit('connected');
    });

    it("tells the server about input", function() {
      spyOn(client.connection, 'handle');

      client.handle('handleInput', input);

      expect(
        client.connection.handle
      ).toHaveBeenCalledWith('sendMessage', {type: 'playerInput', input: input});
    });

    it("updates the simulation with input", function() {
      spyOn(client.connection, 'handle');

      var playerId = 'foo';
      client.connection.emit('receiveMessage', {type: 'controlPlayer', playerId: playerId});
      client.handle('handleInput', input);

      expect(simulation.playerInputs[playerId]).toEqual(input);
    });
  });
});
