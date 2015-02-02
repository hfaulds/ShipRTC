var alt = require('../alt');
var LobbyActions = require('../actions/lobby_actions');

function LobbyStore() {
  this.bindActions(LobbyActions);
}

LobbyStore.prototype.onRefreshLobbies = function(lobbies) {
  this.lobbies = lobbies;
};

module.exports = alt.createStore(LobbyStore);
