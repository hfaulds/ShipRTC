var _ = require("lodash");

var SnapshotPool = require('../../js/client/snapshot_pool');

describe("SnapshotPool", function() {
  var snapshotPool;

  beforeEach(function() {
    snapshotPool = new SnapshotPool();
  });

  describe("#addSnapshot", function() {
    it("adds snapshot to the pool", function() {
      var snapshot = { x: 0, y:0, rotation: 0 };

      snapshotPool.addSnapshot('a', snapshot);

      expect(
        snapshotPool.currentSnapshot()
      ).toEqual({
        x: 0, y:0, rotation: 0
      });
    });
  });

  describe("#adjustSnapshots", function() {
    it("adjusts all snapshots since snapshotId with difference", function() {
      var snapshot1 = {
        player: { x: 1, y:0, rotation: 0 }
      };
      var snapshot2 = {
        player: { x: 2, y:0, rotation: 0 }
      };
      var snapshot3 = {
        player: { x: 3, y:0, rotation: 5 }
      };

      snapshotPool.addSnapshot('a', snapshot1);
      snapshotPool.addSnapshot('b', snapshot2);
      snapshotPool.addSnapshot('c', snapshot3);

      snapshotPool.adjustSnapshots('b', {
        player: {
          x: 1, y:0, rotation: 10
        }
      });

      expect(
        snapshotPool.snapshots
      ).toEqual([
        { player: { x: 1, y:0, rotation: 0 } },
        { player: { x: 1, y:0, rotation: 10 } },
        { player: { x: 2, y:0, rotation: 15 } },
      ]);
    });
  });
});
