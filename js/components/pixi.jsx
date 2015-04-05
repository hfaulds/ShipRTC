var React = require('react');
var _ = require('lodash');
var PIXI = require('pixi.js');

module.exports = React.createClass({
  gameContainer : new PIXI.DisplayObjectContainer(),
  stage : new PIXI.Stage(0x888888),
  sprites : {},

  _change: function() {
    var spriteDescriptions = this.props.snapshot;

    var added = _.select(spriteDescriptions, function(_, id) {
      return !!this.sprites[id];
    });

    _.each(added, function(description, id) {
      var sprite = this.createSprite(description);
      this.sprites[id] = sprites;
      this.gameContainer.addChild(sprite);
    }.bind(this));

    var removed = _.select(spriteDescriptions, function(_, id) {
      return !this.sprites[id];
    });

    _.each(removed, function(description, id) {
      this.gameContainer.removeChild(this.sprites[id]);
      this.sprites[id] = undefined;
    }.bind(this));

    var playerPosition = PlayerStore.getState().snapshot.self;
    this.background.tilePosition.x = -playerPosition.x;
    this.background.tilePosition.y = -playerPosition.y;

    this.gameContainer.position.x = this.gameContainer.width - playerPosition.x;
    this.gameContainer.position.y = this.gameContainer.height - playerPosition.y;
  },

  createSprite : function(description) {
    var sprite = PIXI.Sprite.fromImage(description.image);
    sprite.pivot.x = decription.width / 2;
    sprite.pivot.y = decription.height / 2;
    return sprite;
  },

  createBackground: function(width, height) {
    var backgroundTexture = PIXI.Texture.fromImage(this.props.backgroundImage);
    background = new PIXI.TilingSprite(backgroundTexture, width, height);
    background.pivot.x = background.width / 2;
    background.pivot.y = background.height / 2;
    return background;
  },

  componentDidMount : function() {
    var canvas = this.getDOMNode();

    var width = canvas.clientWidth;
    var height = canvas.clientHeight;

    this.background = this.createBackground(width, height);
    this.gameContainer.position.x = width / 2;
    this.gameContainer.position.y = height / 2;
    this.gameContainer.addChildAt(this.background, 0);
    stage.addChild(this.gameContainer);

    var renderer = new PIXI.WebGLRenderer(width, height, { view: canvas });
    var animate = function() {
      window.requestAnimationFrame(animate);
      renderer.render(stage);
    }.bind(this);

    animate();
  },

  render: function() {
    return <canvas style={{width: this.props.width, height: this.props.height}}/>
  }
});
