var LobbyServerActions = require('../actions/lobby_server_actions');
var request = require('request');

function LobbyApiUtils() {
}

LobbyApiUtils.refreshLobbies = function() {
  var url = [window.location.protocol, '//', window.location.host, '/lobbies'].join('');
  var that = this;
  this.request = request(url, function (error, response, data) {
    if (!error && response.statusCode == 200) {
      LobbyServerActions.lobbiesRefreshed(JSON.parse(data));
    }
    that.request = undefined;
  });
};

LobbyApiUtils.cancelRefresh = function() {
  if(this.request) {
    this.request.abort();
  }
};

module.exports = LobbyApiUtils;
