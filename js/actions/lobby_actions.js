var alt = require('../alt');
var LobbyApiUtils = require('../utils/lobby_api_utils');

function LobbyActions() {
}

LobbyActions.prototype.cancelRefresh = function() {
  this.dispatch();
  LobbyApiUtils.cancelRefresh();
};

LobbyActions.prototype.refreshLobbies = function() {
  this.dispatch();
  LobbyApiUtils.refreshLobbies();
};

module.exports = alt.createActions(LobbyActions);
