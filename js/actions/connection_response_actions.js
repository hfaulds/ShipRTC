var alt = require('../alt');

function ConnectionResponseActions() {
  this.generateActions('connected', 'disconnected', 'receiveMessage');
}

module.exports = alt.createActions(ConnectionResponseActions);
