var alt = require('../alt');

function LobbyServerActions() {
  this.generateActions('lobbiesRefreshed');
}

module.exports = alt.createActions(LobbyServerActions);
