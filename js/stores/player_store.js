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

PlayerStore.prototype.onNewPlayer = function(player) {
  this.players[player.playerId] = {
    sprite: "images/PlayerShips/playerShip2_red.png",
    x: player.position.x,
    y: player.position.y,
    rotation: player.position.rotation
  };
};

PlayerStore.prototype.onRemovePlayer = function(playerId) {
  delete this.players[playerId];
};

module.exports = alt.createStore(PlayerStore);
