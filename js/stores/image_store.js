var alt = require('../alt');

var ImageLoadingActions = require('../actions/image_loading_actions');

function ImageStore() {
  this.bindActions(ImageLoadingActions);
  this.imagesLoaded = false;
  this.textures = {};
}

ImageStore.prototype.onImagesLoaded = function(textures) {
  this.imagesLoaded = true;
  this.textures = textures;
};

module.exports = alt.createStore(ImageStore, 'ImageStore');
