var alt = require('../alt');

function ImageLoadingActions() {
}

ImageLoadingActions.prototype.imagesLoaded = function(textures) {
  this.dispatch(textures);
};

module.exports = alt.createActions(ImageLoadingActions);
