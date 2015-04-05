var alt = require('../alt');
var _ = require('lodash');

var ConnectionResponseActions = require('../actions/connection_response_actions');

function PlayerStore() {
  this.bindActions(ConnectionResponseActions);

  this.players = {
    self: { x:0, y:0 }
  };
}

PlayerStore.prototype.onReceiveSnapshot = function(newSnapshot) {
  this.players = newSnapshot;
};

module.exports = alt.createStore(PlayerStore, 'PlayerStore');
