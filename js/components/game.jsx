var React = require('react');

var _ = require('lodash');

var PlayerStore = require('../stores/player_store');
var InputActions = require('../actions/input_actions');

module.exports = React.createClass({
  HEIGHT: 600,

  componentWillMount: function() {
    this.gameContainer = PlayerStore.getState().gameContainer;
    PlayerStore.listen(this._onChange)
  },

  componentWillUnmount: function() {
    PlayerStore.unlisten(this._onChange)
  },

  _keyDown: function(e) {
    InputActions.inputChange(e.keyCode, 1);
  },

  _keyUp: function(e) {
    InputActions.inputChange(e.keyCode, 0);
  },

  componentDidMount: function() {
    var PIXI = require('pixi.js');

    var canvas = this.getDOMNode();

    this.stage = new PIXI.Stage(0x888888),
    this.renderer = new PIXI.WebGLRenderer(
      canvas.clientWidth,
      canvas.clientHeight,
      { view: canvas }
    );

    var loader = new PIXI.AssetLoader([
      "images/PlayerShips/playerShip2_blue.png",
      "images/PlayerShips/playerShip2_red.png",
      "images/Backgrounds/darkPurple.png",
    ]);
    var backgroundTexture = PIXI.Texture.fromImage("images/Backgrounds/darkPurple.png");
    var background = new PIXI.TilingSprite(backgroundTexture, this.renderer.width, this.renderer.height);
    background.pivot.x = background.width / 2;
    background.pivot.y = background.height / 2;

    this.gameContainer.position.x = this.renderer.width / 2;
    this.gameContainer.position.y = this.renderer.height / 2;

    this.stage.addChild(this.gameContainer);
    this.gameContainer.addChild(background);

    var animate = function() {
      window.requestAnimationFrame(animate);
      this.renderer.render(this.stage);
    }.bind(this);

    loader.onComplete = function() {
      _.each(PlayerStore.getState().ships, function(ship) {
        ship.pivot.x = ship.width / 2;
        ship.pivot.y = ship.height / 2;
      });
      animate();
    }.bind(this);
    loader.load();

    window.addEventListener("keydown", this._keyDown);
    window.addEventListener("keyup", this._keyUp);
  },

  componentWillUnmount: function() {
    window.removeEventListener("keydown", this._keyDown);
    window.removeEventListener("keyup", this._keyUp);
  },

  render: function() {
    return <canvas style={{width: '100%', height: this.HEIGHT}}/>
  }
});
