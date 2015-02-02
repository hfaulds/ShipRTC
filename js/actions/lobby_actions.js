var alt = require('../alt');
var http = require('http');

function LobbyActions() {
}

LobbyActions.prototype.refreshLobbies = function() {
  if(global.document) {
    var that = this;
    http.get(global.document.URL + 'lobbies', function(res) {
      if(res.statusCode == 200) {
        var str = '';

        res.on('data', function (chunk) {
          str += chunk;
        });

        res.on('end', function () {
          that.dispatch(JSON.parse(str));
        });
      }
    });
  }
};

module.exports = alt.createActions(LobbyActions);
