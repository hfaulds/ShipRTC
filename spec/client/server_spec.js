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
      connectionPool = new ConnectionPool({ 'c0': fakeConnection }, fakeLobbyServer);
      spyOn(connectionPool, 'createConnection').and.returnValue(fakeConnection);
    });

    describe("on connected", function() {
      it("tells the new player about the existing players", function() {
        spyOn(connectionPool, 'sendTo');

        var server = new Server(fakeLobbyServer, connectionPool);
        fakeLobbyServer.emit('createConnection', 1);
        fakeConnection.emit('connected', 'c0');

        expect(connectionPool.sendTo).toHaveBeenCalledWith('c0', {
          type: 'newPlayer',
          playerId: 'server',
          position: { x: 0, y: 0, rotation: 0 }
        });
      });

      it("adds the player to the simulation", function() {
      });

      it("tells the existing players about the new players", function() {
      });

      it("tells the new plyaer which playerId it has", function() {
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
