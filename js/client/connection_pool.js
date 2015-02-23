var Connection = require("./connection");
var Events = require("minivents");
var _ = require('lodash');

function ConnectionPool(lobbyServer) {
  this.connections = {};
  this.events = new Events();

  var that = this;
  lobbyServer.on('createConnection', function(negotiatorId) {
    that.createConnection(negotiatorId);
  });

  lobbyServer.on('createOffer', function(id) {
    that.connections[id].handle("createOffer");
  });

  lobbyServer.on('receiveOffer', function(id, offer) {
    that.connections[id].handle("receiveOffer", offer);
  });

  lobbyServer.on('acceptAnswer', function(id, answer) {
    that.connections[id].handle("acceptAnswer", answer);
  });

  lobbyServer.on('addIceCandidate', function(id, candidate) {
    that.connections[id].handle("addIceCandidate", candidate);
  });
  this.lobbyServer = lobbyServer;
}

ConnectionPool.prototype.createConnection = function(negotiatorId) {
  var connectionId = 'c' + _.keys(this.connections).length;
  var connection = new Connection(undefined, connectionId, negotiatorId, this.lobbyServer);
  var that = this;

  connection.on("connected", function() {
    that.events.emit("connected", connectionId);
  });

  connection.on("receiveMessage", function(message) {
    that.events.emit("receiveMessage", connectionId, message);
  });

  connection.handle("connect");
  that.connections[connectionId] = connection;
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

ConnectionPool.prototype.on = function(event, callback) {
  this.events.on(event, callback);
};

module.exports = ConnectionPool;
