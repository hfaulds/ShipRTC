var _ = require('lodash');
if(global.document) var PIXI = require('pixi.js');

var RADIANS_PER_MS = 200;
var UNITS_PER_MS = 0.5;

function Simulation() {
  this.playerPositions = {
    'server' : { x: 0, y:0, rotation: 0 }
  };
  this.playerInputs = { };
  this.lastTickTime = new Date();
}

Simulation.prototype.tick = function() {
  var that = this;

  var currentTickTime = new Date();
  var dt = currentTickTime - this.lastTickTime;
  this.lastTickTime = currentTickTime;

  _.each(this.playerInputs, function(input, id) {
    var position = that.playerPositions[id];

    if(input.forward && input.forward !== 0) {
      var movementDirection = new PIXI.Matrix();
      movementDirection.translate(0, input.forward * UNITS_PER_MS * dt);
      movementDirection.rotate(position.rotation);

      var movement = movementDirection.apply(new PIXI.Point());
      position.x += movement.x;
      position.y += movement.y;
      position.dirty = true;
    }

    if(input.rotation && input.rotation !== 0) {
      position.rotation += input.rotation * dt / RADIANS_PER_MS;
      position.dirty = true;
    }

    that.playerPositions[id] = position;
  });
};

Simulation.prototype.movePlayer = function(playerId, position) {
  var currentPos = this.playerPositions[playerId];
  var makeMovement = ( Math.abs(currentPos.x - position.x) +
                      Math.abs(currentPos.y - position.y) ) > 200;

  if(makeMovement) {
    this.playerPositions[playerId] = position;
  }

  return makeMovement;
};

Simulation.prototype.initPlayer = function(playerId) {
  this.playerPositions[playerId] = { x: 0, y:0, rotation: 0 };
};

module.exports = Simulation;
