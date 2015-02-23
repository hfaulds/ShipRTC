var _ = require('lodash');
if(global.document) var PIXI = require('pixi.js');

function Simulation() {
  this.playerPositions = {
    'server' : { x: 0, y:0, rotation: 0 }
  };
  this.playerInputs = { };
}

Simulation.prototype.tick = function() {
  var that = this;
  _.each(this.playerInputs, function(input, id) {
    var position = that.playerPositions[id];

    if(input.forward && input.forward !== 0) {
      var movementDirection = new PIXI.Matrix();
      movementDirection.translate(0, input.forward * 5);
      movementDirection.rotate(position.rotation);

      var movement = movementDirection.apply(new PIXI.Point());
      position.x += movement.x;
      position.y += movement.y;
      position.dirty = true;
    }

    if(input.rotation && input.rotation !== 0) {
      position.rotation += input.rotation * Math.PI / 64;
      position.dirty = true;
    }

    that.playerPositions[id] = position;
  });
};

module.exports = Simulation;
