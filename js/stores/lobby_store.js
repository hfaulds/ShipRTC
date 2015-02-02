var alt = require('../alt');
var LobbyActions = require('../actions/lobby_actions');

function LobbyStore() {
  if(global.document) {
    var domNode = document.getElementById('lobbies');
    this.lobbies = JSON.parse(domNode.dataset.lobbies);
  }
  this.bindActions(LobbyActions);
}

LobbyStore.prototype.onRefreshLobbies = function(lobbies) {
  this.lobbies = lobbies;
};

module.exports = alt.createStore(LobbyStore);
