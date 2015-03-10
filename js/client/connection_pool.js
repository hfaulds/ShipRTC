var Connection = require("./connection");
var _ = require('lodash');

function ConnectionPool(connections) {
  this.connections = connections || {};
}

ConnectionPool.prototype.createConnection = function(negotiatorId) {
  var connectionId = 'c' + _.keys(this.connections).length;
  var connection = new Connection(undefined, connectionId, negotiatorId);

  connection.handle("connect");
  this.connections[connectionId] = connection;
  return connection;
};

ConnectionPool.prototype.sendAll = function(data) {
  var that = this;
  _.each(this.connections, function(connection) {
    that.sendTo(connection.id, data);
  });
};

ConnectionPool.prototype.sendTo = function(connectionId, data) {
  this.connections[connectionId].handle('sendMessage', data);
};

ConnectionPool.prototype.sendAllExcept = function(connectionId, data) {
  var that = this;
  _.each(this.connections, function(connection) {
    if(connection.id != connectionId) {
      that.sendTo(connection.id, data);
    }
  });
};

ConnectionPool.prototype.createOffer = function(id) {
  this.connections[id].handle("createOffer");
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
