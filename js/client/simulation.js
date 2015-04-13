var _ = require('lodash');

var Engine = require('matter-js/src/core/Engine');
var Vector = require('matter-js/src/geometry/Vector');
var Body = require('matter-js/src/body/Body');
var World = require('matter-js/src/body/World');
var Bodies = require('matter-js/src/factory/Bodies');

var RADIANS_PER_MS = 200;
var UNITS_PER_MS = 0.05;

function Simulation() {
  this.playerPositions = {
    'server' : this.createRect(),
    'self' : this.createRect(),
  };
  this.playerInputs = { };
  this.lastTickTime = new Date();

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

  this._deltaSampleSize = 60;
  this.deltaHistory = [];
  this.timeScalePrev = 1;
  this.correction = 1;
  this.engine = Engine.create(options);
  World.add(this.engine.world, _.values(this.playerPositions));
}

Simulation.prototype.createRect = function() {
  var rect = Bodies.rectangle(-56, -37.5, 112, 75);
  rect.frictionAir = 0.01;
  return rect;
};

Simulation.prototype.tick = function() {
  var that = this;

  var currentTickTime = new Date();
  var delta = currentTickTime - this.lastTickTime;
  this.lastTickTime = currentTickTime;

  this.deltaHistory.push(delta);
  this.deltaHistory = this.deltaHistory.slice(-this._deltaSampleSize);
  dt = Math.min.apply(null, this.deltaHistory);

  var timing = this.engine.timing;
  delta = delta < timing.deltaMin ? timing.deltaMin : delta;
  delta = delta > timing.deltaMax ? timing.deltaMax : delta;

  this.correction = delta / timing.delta;

  timing.delta = delta;

  if (this.timeScalePrev !== 0)
    this.correction *= timing.timeScale / this.timeScalePrev;

  if (timing.timeScale === 0)
    this.correction = 0;

  this.timeScalePrev = timing.timeScale;


  _.each(this.playerInputs, function(input, id) {
    var rect = that.playerPositions[id];

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
  this.playerPositions[playerId] = this.createRect();
  this.playerInputs[playerId] = { forward: 0, angle: 0 };
};

Simulation.prototype.removePlayer = function(playerId) {
  delete this.playerInputs[playerId];
  delete this.playerPositions[playerId];
};

module.exports = Simulation;
