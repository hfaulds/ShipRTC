var alt = require('../alt');
var _ = require('lodash');

var ConnectionResponseActions = require('../actions/connection_response_actions');

function PlayerStore() {
  this.bindActions(ConnectionResponseActions);

  this.players = {
    self: {
      position: {x:0, y:0 },
      angle: 0,
    }
  };
}

PlayerStore.prototype.onReceiveSnapshot = function(newSnapshot) {
  this.players = newSnapshot;
};

module.exports = alt.createStore(PlayerStore, 'PlayerStore');
