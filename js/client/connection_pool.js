var Connection = require("./connection");
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
      that.connections[id].handle.apply(undefined, args);
    });
  });
}

ConnectionPool.prototype.createConnection = function(negotiatorId) {
  var connectionId = 'c' + _.keys(this.connections).length;
  var connection = new Connection(this.negotiator, negotiatorId);

  connection.handle("connect", connectionId);
  this.connections[connectionId] = connection;
  return connection;
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

ConnectionPool.prototype.createOffer = function(id) {
  console.log(id);
  console.log(this.connections);
};

ConnectionPool.prototype.receiveOffer = function(id, offer) {
  this.connections[id].handle("receiveOffer", offer);
};

ConnectionPool.prototype.acceptAnswer = function(id, answer) {
  this.connections[id].handle("acceptAnswer", answer);
};

ConnectionPool.prototype.addIceCandidate = function(id, candidate) {
  this.connections[id].handle("addIceCandidate", candidate);
};

module.exports = ConnectionPool;
