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
});
