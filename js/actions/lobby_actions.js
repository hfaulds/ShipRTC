var alt = require('../alt');
var request = require('request');

function LobbyActions() {
}

LobbyActions.prototype.refreshLobbies = function() {
  if(global.document) {
    var that = this;
    request(global.document.URL + 'lobbies', function (error, response, data) {
      if (!error && response.statusCode == 200) {
        that.dispatch(JSON.parse(data));
      }
    });
  }
};

module.exports = alt.createActions(LobbyActions);
