var _ = require("lodash");
var Server = require("../../js/client/server");
var ConnectionPool = require("../../js/client/connection_pool");
var EventEmitter = require('events').EventEmitter;

describe("Server", function() {
  var fakeLobbyServer;

  beforeEach(function() {
    fakeLobbyServer = new EventEmitter();
  });

  describe("connection lifecycle", function() {
    var fakeConnection;
    var connectionPool;

    beforeEach(function() {
      fakeConnection = new EventEmitter();
      connectionPool = new ConnectionPool({ 'c0': fakeConnection }, fakeLobbyServer);
      spyOn(connectionPool, 'createConnection').and.returnValue(fakeConnection);
    });

    describe("on creation", function() {
      it("sends current player Positions", function() {
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

      _.each(['startNegotiation', 'shareOffer', 'shareAnswer', 'acceptAnswer', 'shareIceCandidate'], function(event) {
        it("handles " + event + " from connection to lobbyServer", function() {
          var server = new Server(fakeLobbyServer, connectionPool);
          fakeLobbyServer.emit('createConnection', 1);
          spyOn(fakeLobbyServer, 'emit');
          fakeConnection.emit(event, 'arg');

          expect(fakeLobbyServer.emit).toHaveBeenCalledWith(event, 'arg');
        });
      });

      it("initializes the player in the simulation", function() {
      });
    });

    describe("on connected", function() {
      it("adds the player to the simulation", function() {
      });
    });

    describe("on message", function() {
      it("adds the player to the simulation", function() {
      });
    });

    describe("on disconnected", function() {
      it("removes the player form the simulation", function() {
      });
    });
  });
});
