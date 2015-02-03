var alt = require('../alt');
var ConnectionActions = require('../actions/connection_actions');
var ConnectionResponseActions = require('../actions/connection_response_actions');

function MessageStore() {
  this.bindActions(ConnectionActions);
  this.bindActions(ConnectionResponseActions);
  this.messages = [];
}

MessageStore.prototype.onSendMessage = function(message) {
  this.messages.push(message);
};

MessageStore.prototype.onReceiveMessage = function(message) {
  this.messages.push(message);
};

module.exports = alt.createStore(MessageStore);
