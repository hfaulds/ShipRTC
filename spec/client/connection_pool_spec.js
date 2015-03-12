var _ = require("lodash");
var ConnectionPool = require("../../js/client/connection_pool");
var Connection = require("../../js/client/connection");
var EventEmitter = require('events').EventEmitter;

describe("ConnectionPool", function() {
  var fakeNegotiator;

  beforeEach(function() {
    fakeNegotiator = new EventEmitter();
  });

  describe("connection signalling", function() {
    var events = ['createOffer', 'receiveOffer', 'acceptAnswer', 'addIceCandidate'];

    _.each(events, function(event) {
      it("delegates " + event + " to correct connection", function() {
        var connection = new Connection();
        spyOn(connection, 'handle');

        var connectionPool = new ConnectionPool({ 'a': connection }, fakeNegotiator);
        fakeNegotiator.emit(event, 'a', 'arg');
        expect(connection.handle).toHaveBeenCalledWith(event, 'arg');
      });
    });
  });

  describe("#createConnection", function() {
    it("creates a connection", function() {
      var connectionPool = new ConnectionPool({}, fakeNegotiator);

      var negotiatorId = 0;
      connectionPool.createConnection(negotiatorId);

      expect(_.size(connectionPool.connections)).toEqual(1);
    });

    it("returns the connection", function() {
      var connectionPool = new ConnectionPool({}, fakeNegotiator);

      var negotiatorId = 0;
      expect(
        connectionPool.createConnection(negotiatorId)
      ).toEqual(
        _.values(connectionPool.connections)[0]
      );
    });
  });

  describe("#sendTo", function() {
    it("calls send on a connection", function() {
      var connection = new Connection();
      spyOn(connection, 'handle');

      var connectionPool = new ConnectionPool({ 'a': connection }, fakeNegotiator);
      connectionPool.sendTo('a', 'foo');

      expect(connection.handle).toHaveBeenCalledWith('sendMessage', 'foo');
    });
  });

  describe("#sendAll", function() {
    it("calls send all connections", function() {
      var connections = _.times(10, function(id) {
        var connection = new Connection(undefined, id);
        spyOn(connection, 'handle');
        return connection;
      });

      var connectionPool = new ConnectionPool(_.extend({}, connections), fakeNegotiator);
      connectionPool.sendAll('foo');

      _.each(connections, function(connection) {
        expect(connection.handle).toHaveBeenCalledWith('sendMessage', 'foo');
      });
    });
  });

  describe("#sendAllExcept", function() {
    it("sends to all connections except", function() {
      var connectionsToSendTo = _.times(10, function(id) {
        var connection = new Connection(undefined, id);
        spyOn(connection, 'handle');
        return connection;
      });
      var connectionToNotSentTo = new Connection(undefined, '10');
      spyOn(connectionToNotSentTo, 'handle');
      var connections = connectionsToSendTo.concat(connectionToNotSentTo);

      var connectionPool = new ConnectionPool(_.extend({}, connections), fakeNegotiator);
      connectionPool.sendAllExcept('10', 'foo');

      _.each(connectionsToSendTo, function(connection) {
        expect(connection.handle).toHaveBeenCalledWith('sendMessage', 'foo');
      });

      expect(connectionToNotSentTo.handle.calls.any()).toEqual(false);
    });
  });
});
