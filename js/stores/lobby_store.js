var alt = require('../alt');
var LobbyServerActions = require('../actions/lobby_server_actions');

function LobbyStore() {
  this.bindActions(LobbyServerActions);
}

LobbyStore.prototype.onLobbiesRefreshed = function(lobbies) {
  this.lobbies = lobbies;
};

module.exports = alt.createStore(LobbyStore);
