var _ = require("lodash");

function SnapshotPool() {
  this.snapshotCount = 10;
  this.snapshotIds = [];
  this.snapshots = [];
}

SnapshotPool.prototype.currentSnapshot = function() {
  return _.last(this.snapshots);
};

SnapshotPool.prototype.addSnapshot = function(snapshotId, snapshot) {
  if(_.last(this.snapshotIds) !== snapshotId) {
    this.snapshotIds.push(snapshotId);
    if(this.snapshotIds.length > this.snapshotCount) {
      this.snapshotIds.shift();
    }
    this.snapshots.push(snapshot);
    if(this.snapshots.length > this.snapshotCount) {
      this.snapshots.shift();
    }
  }
};

SnapshotPool.prototype.adjustSnapshots = function(snapshotId, newSnapshot) {
  var snapshotIndex = _.indexOf(this.snapshotIds, snapshotId);
  if(snapshotIndex > -1) {
    var old = this.snapshots[snapshotIndex];

    _.each(old, function(oldState, playerId) {
      var newState = newSnapshot[playerId];

      var xDiff = roundNumber(newState.x - oldState.x, 4);
      var yDiff = roundNumber(newState.y - oldState.y, 4);
      var rDiff = roundNumber(newState.rotation - oldState.rotation, 4);

      if(xDiff !== 0 || yDiff !== 0 || rDiff !== 0) {
        _.each(this.snapshots.slice(snapshotIndex), function(snapshot) {
          snapshot[playerId].x += xDiff;
          snapshot[playerId].y += yDiff;
          snapshot[playerId].rotation += rDiff;
        }.bind(this));
      }
    }.bind(this));
  }
};

function roundNumber(number, digits) {
  var multiple = Math.pow(10, digits);
  var rndedNum = Math.round(number * multiple) / multiple;
  return rndedNum;
}

module.exports = SnapshotPool;
