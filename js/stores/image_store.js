var alt = require('../alt');

var ImageLoadingActions = require('../actions/image_loading_actions');

function ImageStore() {
  this.bindActions(ImageLoadingActions);
  this.imagesLoaded = false;
}

ImageStore.prototype.onImagesLoaded = function() {
  this.imagesLoaded = true;
};

module.exports = alt.createStore(ImageStore, 'ImageStore');
