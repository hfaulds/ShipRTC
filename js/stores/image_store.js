var alt = require('../alt');

var ImageLoadingActions = require('../actions/image_loading_actions');

function ImageStore() {
  this.bindActions(ImageLoadingActions);
  this.imagesLoaded = false;
}

ImageStore.prototype.onImagesLoaded = function() {
  this.imageState = true;
};

module.exports = alt.createStore(ImageStore, 'ImageStore');
