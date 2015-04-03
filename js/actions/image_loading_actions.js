var alt = require('../alt');

function ImageLoadingActions() {
}

ImageLoadingActions.prototype.imagesLoaded = function(lobbyId) {
  this.dispatch();
};

module.exports = alt.createActions(ImageLoadingActions);
