var alt = require('../alt');
var LobbyActions = require('../actions/lobby_actions');

var ImageLoadingUtils = require('../utils/image_loading_utils');

function ConnectionResponseActions() {
  this.generateActions('receiveMessage', 'receiveSnapshot');
}

ConnectionResponseActions.prototype.connected = function() {
  this.dispatch();
  ImageLoadingUtils.loadImages();
};

ConnectionResponseActions.prototype.disconnected = function() {
  this.dispatch();
  LobbyActions.refreshLobbies();
};

module.exports = alt.createActions(ConnectionResponseActions);
