var Connection = require("./connection");
var Negotiator = require("./negotiator");
var _ = require('lodash');

function ConnectionPool(connections, negotiator) {
  this.connections = connections;
  this.negotiator = negotiator;

  var that = this;
  _.each([
    'createOffer', 'receiveOffer', 'acceptAnswer', 'addIceCandidate'
  ], function(event) {
    negotiator.on(event, function() {
      var id = _.first(arguments);
      var args = _.union([event], _.slice(arguments, 1));
      var connection = that.connections[id];
      connection.handle.apply(connection, args);
    });
  });
}

ConnectionPool.prototype.createConnection = function(negotiatorId) {
  var connectionId = 'c' + _.keys(this.connections).length;
  var negotiator = new Negotiator(this.negotiator, negotiatorId);
  var connection = new Connection(negotiator, connectionId);

  connection.handle("connect", connectionId);
  this.connections[connectionId] = connection;
  return connection;
};

ConnectionPool.prototype.each = function(callback) {
  _.each(this.connections, callback);
};

ConnectionPool.prototype.sendAll = function(data) {
  var that = this;
  _.each(this.connections, function(_, id) {
    that.sendTo(id, data);
  });
};

ConnectionPool.prototype.sendTo = function(connectionId, data) {
  this.connections[connectionId].handle('sendMessage', data);
};

ConnectionPool.prototype.sendAllExcept = function(connectionId, data) {
  var that = this;
  _.each(this.connections, function(_, id) {
    if(id != connectionId) {
      that.sendTo(id, data);
    }
  });
};

module.exports = ConnectionPool;
