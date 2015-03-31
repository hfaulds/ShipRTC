var alt = require('../alt');

var ConnectionApiUtils = require('../utils/connection_api_utils');

function GameSettingsActions() {
}

GameSettingsActions.prototype.setSimulatedLatency = function(latency) {
  ConnectionApiUtils.setSimulatedLatency(latency);
  this.dispatch(latency);
};

GameSettingsActions.prototype.setSimulatedPacketLoss = function(packetLoss) {
  ConnectionApiUtils.setSimulatedPacketLoss(packetLoss);
  this.dispatch(packetLoss);
};

GameSettingsActions.prototype.toggleClientPrediction = function(toggle) {
  ConnectionApiUtils.toggleClientPrediction(toggle);
  this.dispatch(toggle);
};

module.exports = alt.createActions(GameSettingsActions);
