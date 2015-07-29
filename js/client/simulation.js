var _ = require('lodash');

var Engine = require('matter-js/src/core/Engine');
var Vector = require('matter-js/src/geometry/Vector');
var Body = require('matter-js/src/body/Body');
var World = require('matter-js/src/body/World');
var Bodies = require('matter-js/src/factory/Bodies');

var RADIANS_PER_MS = 200;
var UNITS_PER_MS = 0.05;

function Simulation() {
  var options = {
    render: {
      canvas : {},
      controller: {
        create: function() {}
      }
    },
    world: {
      bounds: {
        min: { x: -Infinity, y: -Infinity },
        max: { x: Infinity, y: Infinity },
      },
      gravity: { x: 0, y: 0}
    }
  };

  this.engine = Engine.create(options);
  this.playerBounds = {
    'self' : this.createRect(),
  };
}

Simulation.prototype.createRect = function() {
  var rect = Bodies.rectangle(-56, -37.5, 112, 75);
  rect.frictionAir = 0.01;
  World.add(this.engine.world, rect);
  return rect;
};

Simulation.prototype.applyInputs = function(dt, inputs) {
  var that = this;
  _.each(inputs, function(input) {
    var rect = that.playerBounds[input.id];

    if(input.forward == -1 || input.forward == 1) {
      Body.applyForce(
        rect,
        rect.position,
        Vector.rotate(
          {
            x: 0,
            y: input.forward * UNITS_PER_MS
          },
          rect.angle
        )
      );
    }

    if(input.rotation == -1 || input.rotation == 1) {
      Body.rotate(
        rect,
        input.rotation * dt / RADIANS_PER_MS * (1 + Math.random() / 10)
      );
    }
  });

  Engine.update(this.engine, timeSlice, 1);
};

Simulation.prototype.tick = function() {
  var that = this;

  _.each(playerInputs, function(input, id) {
    var rect = that.playerBounds[id];

    if(input.forward && input.forward !== 0) {
      Body.applyForce(
        rect,
        rect.position,
        Vector.rotate(
          {
            x: 0,
            y: input.forward * UNITS_PER_MS
          },
          rect.angle
        )
      );
    }

    if(input.rotation && input.rotation !== 0) {
      Body.rotate(
        rect,
        input.rotation * dt / RADIANS_PER_MS * (1 + Math.random() / 10)
      );
    }
  });

  Engine.update(this.engine, dt, this.correction);
};

Simulation.prototype.initPlayer = function(playerId) {
  this.playerBounds[playerId] = this.createRect();
  this.playerInputs[playerId] = { forward: 0, angle: 0 };
};

Simulation.prototype.removePlayer = function(playerId) {
  delete this.playerInputs[playerId];
  delete this.playerBounds[playerId];
};

Simulation.prototype.setPlayerPositions = function(snapshot) {
  _.each(snapshot, function(player, id) {
    var rect = this.playerBounds[id] || this.createRect();
    rect.position.x = player.x;
    rect.position.y = player.y;
    rect.angle = player.rotation;
    this.playerBounds[id] = rect;
  }.bind(this));
};

Simulation.prototype.playerPositions = function() {
  return _.reduce(this.playerBounds, function(positions, rect, id) {
    positions[id] = {
      x: rect.position.x,
      y: rect.position.y,
      rotation: rect.angle,
    };
    return positions;
  }, {});
};

module.exports = Simulation;
