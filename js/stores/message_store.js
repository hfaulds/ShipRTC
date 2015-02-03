var alt = require('../alt');
var ConnectionActions = require('../actions/connection_actions');
var ConnectionResponseActions = require('../actions/connection_response_actions');

function MessageStore() {
  this.bindAction(ConnectionActions.sendMessage, this.onSendMessage);
  this.bindAction(ConnectionResponseActions.receiveMessage, this.onReceiveMessage);
  this.messages = [];
}

MessageStore.prototype.onSendMessage = function() {
};

MessageStore.prototype.onReceiveMessage = function(message) {
  this.messages.push(message);
};

module.exports = alt.createStore(MessageStore);
