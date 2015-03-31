var alt = require('../alt');
var GameSettingsActions = require('../actions/game_settings_actions');

function GameSettingsStore() {
  this.bindActions(GameSettingsActions);

  this.simulatedLatency = 0;
  this.simulatedPacketLoss = 0;
  this.clientPrediction = true;
}

GameSettingsStore.prototype.onSetSimulatedLatency = function(latency) {
  this.simulatedLatency = latency;
};

GameSettingsStore.prototype.onSetSimulatedPacketLoss = function(packetLoss) {
  this.simulatedPacketLoss = packetLoss;
};

GameSettingsStore.prototype.onToggleClientPrediction = function(toggle) {
  this.clientPrediction = toggle;
};

module.exports = alt.createStore(GameSettingsStore, 'GameSettingsStore');
