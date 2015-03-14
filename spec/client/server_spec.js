var _ = require("lodash");
var Server = require("../../js/client/server");
var ConnectionPool = require("../../js/client/connection_pool");
var EventEmitter = require('events').EventEmitter;

describe("Server", function() {
  var fakeLobbyServer;

  beforeEach(function() {
    fakeLobbyServer = new EventEmitter();
  });

  describe("upon registering with the lobbyServer", function() {
    it("", function() {
    });
  });

  describe("after registering with the lobbyServer", function() {
    it("begins the simulation loop", function() {
    });

    it("handles player messages", function() {
    });

    it("handles player input", function() {
    });
  });

  describe("connection lifecycle", function() {
    var fakeConnection;
    var connectionPool;

    beforeEach(function() {
      fakeConnection = new EventEmitter();
      fakeConnection.id = 'c0';
      fakeConnection.handle = function(){};
      connectionPool = new ConnectionPool({ 'c0': fakeConnection }, fakeLobbyServer);
      spyOn(connectionPool, 'createConnection').and.returnValue(fakeConnection);
    });

    describe("on connected", function() {
      it("adds the player to the simulation", function() {
      });
    });

    describe("on message", function() {
      it("adds player input to the simulation", function() {
      });

      it("handles player messages", function() {
      });
    });

    describe("on disconnected", function() {
      it("removes the player form the simulation", function() {
      });

      it("tells existing players that a player has been removed", function() {
      });
    });
  });
});
