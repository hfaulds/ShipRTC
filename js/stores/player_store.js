var alt = require('../alt');
var ConnectionResponseActions = require('../actions/connection_response_actions');

function PlayerStore() {
  this.bindActions(ConnectionResponseActions);
  this.players = [{
    sprite: "images/PlayerShips/playerShip2_blue.png",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0
  }];
}

PlayerStore.prototype.onMovePlayer = function(player) {
  this.players.push();
};

PlayerStore.prototype.onNewPlayer = function() {
  this.players.push({
    sprite: "images/PlayerShips/playerShip2_red.png",
    position: {
      x: 0,
      y: 0,
    },
    rotation: 0
  });
};

PlayerStore.prototype.onPlayerMove = function(player) {
};

module.exports = alt.createStore(PlayerStore);
