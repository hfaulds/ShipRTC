var alt = require('../alt');
var request = require('request');

function LobbyActions() {
}

LobbyActions.prototype.refreshLobbies = function() {
  var that = this;
  var url = [window.location.protocol, '//', window.location.host, '/lobbies'].join('');
  request(url, function (error, response, data) {
    if (!error && response.statusCode == 200) {
      that.dispatch(JSON.parse(data));
    }
  });
};

module.exports = alt.createActions(LobbyActions);
