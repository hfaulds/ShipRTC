var _ = require("lodash");
var ConnectionPool = require("../../js/client/connection_pool");
var Connection = require("../../js/client/connection");

describe("ConnectionPool", function() {
  var connectionPool;

  beforeEach(function() {
    connectionPool =  new ConnectionPool();
  });

  describe("#createConnection", function() {
    it("creates a connection", function() {
      var negotiatorId = 0;
      connectionPool.createConnection(negotiatorId);

      expect(_.size(connectionPool.connections)).toEqual(1);
    });

    it("returns the connection", function() {
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

      var connectionPool = new ConnectionPool({ 'a': connection });
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

      var connectionPool = new ConnectionPool(_.extend({}, connections));
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

      var connectionPool = new ConnectionPool(_.extend({}, connections));
      connectionPool.sendAllExcept('10', 'foo');

      _.each(connectionsToSendTo, function(connection) {
        expect(connection.handle).toHaveBeenCalledWith('sendMessage', 'foo');
      });

      expect(connectionToNotSentTo.handle.calls.any()).toEqual(false);
    });
  });

  describe("#createOffer", function() {
    it("tells the appropriate connection to create an offer", function() {
      var connection = new Connection();
      spyOn(connection, 'handle');

      var connectionPool = new ConnectionPool({ 'a': connection });
      connectionPool.createOffer('a');
      expect(connection.handle).toHaveBeenCalledWith('createOffer');
    });
  });

  describe("#receiveOffer", function() {
    it("passes the offer on to the appropriate connection", function() {
      var connection = new Connection();
      spyOn(connection, 'handle');

      var connectionPool = new ConnectionPool({ 'a': connection });
      connectionPool.receiveOffer('a', 'offer');
      expect(connection.handle).toHaveBeenCalledWith('receiveOffer', 'offer');
    });
  });

  describe("#acceptAnswer", function() {
    it("passes the answer on to the appropriate connection", function() {
      var connection = new Connection();
      spyOn(connection, 'handle');

      var connectionPool = new ConnectionPool({ 'a': connection });
      connectionPool.acceptAnswer('a', 'offer');
      expect(connection.handle).toHaveBeenCalledWith('acceptAnswer', 'offer');
    });
  });

  describe("#addIceCandidate", function() {
    it("passes the candidate on to the appropriate connection", function() {
      var connection = new Connection();
      spyOn(connection, 'handle');

      var connectionPool = new ConnectionPool({ 'a': connection });
      connectionPool.addIceCandidate('a', 'candidate');
      expect(connection.handle).toHaveBeenCalledWith('addIceCandidate', 'candidate');
    });
  });
});
