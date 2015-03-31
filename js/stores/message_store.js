var alt = require('../alt');
var ConnectionActions = require('../actions/connection_actions');
var ConnectionResponseActions = require('../actions/connection_response_actions');

function MessageStore() {
  this.bindActions(ConnectionActions);
  this.bindActions(ConnectionResponseActions);
  this.messages = [];
  this.messageCounts = {};
}

MessageStore.prototype.onSendMessage = function(message) {
  this.messages.push({
    sender: "self",
    body:   message,
    id:     this.incrementMessageCount("self"),
  });
};

MessageStore.prototype.onReceiveMessage = function(message) {
  this.messages.push({
    sender: message.sender,
    body:   message.body,
    id:     this.incrementMessageCount(message.sender),
  });
};

MessageStore.prototype.incrementMessageCount = function(sender) {
  var currentCount = this.messageCounts[sender] || 0;
  var newCount = currentCount + 1;
  this.messageCounts[sender] = newCount;
  return newCount;
};

module.exports = alt.createStore(MessageStore, 'MessageStore');
