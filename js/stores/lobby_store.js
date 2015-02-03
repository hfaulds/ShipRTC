var alt = require('../alt');
var LobbyServerActions = require('../actions/lobby_server_actions');

function LobbyStore() {
  this.bindActions(LobbyServerActions);
  if(global.document) {
    var domNode = document.getElementById('lobbies');
    this.lobbies = JSON.parse(domNode.dataset.lobbies);
  } else {
    this.lobbies = [];
  }
}

LobbyStore.prototype.onLobbiesRefreshed = function(lobbies) {
  this.lobbies = lobbies;
};

module.exports = alt.createStore(LobbyStore);
