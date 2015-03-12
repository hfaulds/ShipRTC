var _ = require('lodash');

function Negotiator(connection, id) {
  this.connection = connection;
  this.id = id;
}

Negotiator.prototype.emit = function() {
  var event = _.first(arguments);
  var args = _.union([event, this.id], _.slice(arguments,1));
  this.connection.emit.apply(this.connection, args);
};

module.exports = Negotiator;
