var alt = require('../alt');

function GameSettingsActions() {
}

GameSettingsActions.prototype.setSimulatedLatency = function(latency) {
  this.dispatch(latency);
};

GameSettingsActions.prototype.setSimulatedPacketLoss = function(packetLoss) {
  this.dispatch(packetLoss);
};

GameSettingsActions.prototype.toggleClientPrediction = function(toggle) {
  this.dispatch(toggle);
};

module.exports = alt.createActions(GameSettingsActions);
