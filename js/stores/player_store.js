var alt = require('../alt');
var ConnectionResponseActions = require('../actions/connection_response_actions');

function PlayerStore() {
  this.bindActions(ConnectionResponseActions);
  this.players = {};
}

PlayerStore.prototype.onMovePlayer = function(movement) {
  var player = this.players[movement.playerId];
  player.x = movement.position.x;
  player.y = movement.position.y;
  player.rotation = movement.position.rotation;
};

PlayerStore.prototype.onNewPlayer = function(playerId) {
  this.players[playerId] = {
    sprite: "images/PlayerShips/playerShip2_red.png",
    x: 0,
    y: 0,
    rotation: 0
  };
};

module.exports = alt.createStore(PlayerStore);
