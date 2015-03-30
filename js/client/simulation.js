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
    }

    if(input.rotation && input.rotation !== 0) {
      position.rotation += input.rotation * dt / RADIANS_PER_MS;
    }

    that.playerPositions[id] = position;
  });
};

Simulation.prototype.initPlayer = function(playerId) {
  this.playerPositions[playerId] = { x: 0, y:0, rotation: 0 };
  this.playerInputs[playerId] = { forward: 0, rotation: 0 };
};

Simulation.prototype.removePlayer = function(playerId) {
  delete this.playerInputs[playerId];
  delete this.playerPositions[playerId];
};

module.exports = Simulation;
