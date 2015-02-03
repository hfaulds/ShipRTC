var alt = require('../alt');

function ConnectionResponseActions() {
  this.generateActions('connected', 'receiveMessage');
}

module.exports = alt.createActions(ConnectionResponseActions);
