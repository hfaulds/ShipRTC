var alt = require('../alt');
var _ = require('lodash');

if(global.document) var PIXI = require('pixi.js');

var ConnectionResponseActions = require('../actions/connection_response_actions');

function PlayerStore() {
  this.bindActions(ConnectionResponseActions);

  if(global.document) this.gameContainer = new PIXI.DisplayObjectContainer();
  this.snapshot = {};
  this.ships = {};
}

PlayerStore.prototype.onReceiveSnapshot = function(newSnapshot) {
  var lastSnapshot = this.snapshot;

  var addedPlayerIds = _.difference(
    _.keys(newSnapshot),
    _.keys(lastSnapshot)
  );

  var removedPlayerIds = _.difference(
    _.keys(lastSnapshot),
    _.keys(newSnapshot)
  );

  _.each(addedPlayerIds, function(id) {
    var player = newSnapshot[id];

    var ship = PIXI.Sprite.fromImage("images/PlayerShips/playerShip2_red.png");
    ship.pivot.x = ship.width / 2;
    ship.pivot.y = ship.height / 2;

    this.ships[id] = ship;
    this.gameContainer.addChild(ship);
  }.bind(this));

  _.each(removedPlayerIds, function(id) {
    this.gameContainer.removeChild(this.ships[id]);
    delete this.ships[id];
  }.bind(this));

  _.each(newSnapshot, function(player, id) {
    var ship = this.ships[id];
    ship.position.x = player.x;
    ship.position.y = player.y;
    ship.rotation = player.rotation;
  }.bind(this));

  this.snapshot = newSnapshot;
};

module.exports = alt.createStore(PlayerStore);
