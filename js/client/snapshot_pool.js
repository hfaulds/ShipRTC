var _ = require("lodash");

function SnapshotPool() {
  this.snapshotCount = 200;
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
    this.snapshots.push(_.cloneDeep(snapshot));
    if(this.snapshots.length > this.snapshotCount) {
      this.snapshots.shift();
    }
  }
};

SnapshotPool.prototype.adjustSnapshots = function(snapshotId, newSnapshot) {
  var snapshotIndex = _.indexOf(this.snapshotIds, snapshotId);
  if(snapshotIndex > -1) {
    var oldSnapshot = this.snapshots[snapshotIndex];
    this.snapshots = this.snapshots.slice(snapshotIndex);
    this.snapshotIds = this.snapshotIds.slice(snapshotIndex);

    this.updateControlledObjects(newSnapshot, oldSnapshot, snapshotId);
    this.updateUncontrolledObjects(newSnapshot, oldSnapshot);
  } else {
    console.log('miss ' + snapshotId);
  }
};

SnapshotPool.prototype.updateControlledObjects = function(newSnapshot, oldSnapshot, snapshotId) {
  var newState = newSnapshot.self;
  var oldState = oldSnapshot.self;

  if(newState && oldState) {
    var xDiff = newState.x - oldState.x;
    var yDiff = newState.y - oldState.y;
    var rDiff = newState.r - oldState.r;

    var diff = Math.abs(xDiff) + Math.abs(yDiff);

    if(diff > 1 || Math.abs(rDiff) > 0.05) {
      _.each(this.snapshots, function(snapshot, i) {
        var self = snapshot.self;
        self.x += xDiff;
        self.y += yDiff;
        self.r += rDiff;

        self.dx = newState.dx;
        self.dy = newState.dy;
        self.dr = newState.dr;
      });
    }
  } else if(newState) {
    _.each(this.snapshots, function(snapshot, i) {
      snapshot.self = _.cloneDeep(newState);
    });
  }
};

SnapshotPool.prototype.updateUncontrolledObjects = function(newSnapshot, oldSnapshot) {
  var newIds = _.keys(newSnapshot);
  var oldIds = _.keys(oldSnapshot);
  var ids = _.without(_.union(newIds, oldIds), 'self');

  _.each(ids, function(playerId) {
    var newState = newSnapshot[playerId];
    var oldState = oldSnapshot[playerId];
    if(newState) {
      _.each(this.snapshots, function(snapshot) {
        snapshot[playerId] = _.cloneDeep(newState);
      });
    } else if(oldState) {
      _.each(this.snapshots, function(snapshot) {
        delete snapshot[playerId];
      });
    }
  }.bind(this));
};

module.exports = SnapshotPool;
