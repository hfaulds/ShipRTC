var _ = require('lodash');

var ImageLoadingActions = require('../actions/image_loading_actions');

var ASSETS = [
  "images/PlayerShips/playerShip2_blue.png",
  "images/PlayerShips/playerShip2_red.png",
  "images/Backgrounds/darkPurple.png",
];

function ImageLoadingUtils() {
}

ImageLoadingUtils.loadImages = function() {
  var PIXI = require('pixi.js');
  var loader = new PIXI.AssetLoader(ASSETS);
  loader.onComplete = function() {
    var textures = _.reduce(ASSETS, function(r, url) {
      r[url] = PIXI.Texture.fromImage(url);
      return r;
    }, {});
    ImageLoadingActions.imagesLoaded(textures);
  };
  loader.load();
};

module.exports = ImageLoadingUtils;
