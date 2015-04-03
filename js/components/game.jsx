var React = require('react');

var _ = require('lodash');

var PlayerStore = require('../stores/player_store');

var InputActions = require('../actions/input_actions');

module.exports = React.createClass({
  HEIGHT: 600,

  _keyDown: function(e) {
    InputActions.inputChange(e.keyCode, 1);
  },

  _keyUp: function(e) {
    InputActions.inputChange(e.keyCode, 0);
  },

  _onChange: function() {
    if(this.background) {
      var playerPosition = PlayerStore.getState().snapshot.self;
      this.background.tilePosition.x = -playerPosition.x;
      this.background.tilePosition.y = -playerPosition.y;
    }
  },

  componentWillUnmount: function() {
    PlayerStore.unlisten(this._onChange)
  },

  componentWillMount: function() {
    this.gameContainer = PlayerStore.getState().gameContainer;
    PlayerStore.listen(this._onChange)
  },

  componentDidMount: function() {
    var PIXI = require('pixi.js');

    var canvas = this.getDOMNode();
    var stage = new PIXI.Stage(0x888888);
    stage.addChild(this.gameContainer);

    var renderer = new PIXI.WebGLRenderer(canvas.clientWidth, canvas.clientHeight, { view: canvas });
    this.gameContainer.position.x = renderer.width / 2;
    this.gameContainer.position.y = renderer.height / 2;

    var backgroundTexture = PIXI.Texture.fromImage("images/Backgrounds/darkPurple.png");
    this.background = new PIXI.TilingSprite(backgroundTexture, renderer.width, renderer.height);
    this.background.pivot.x = this.background.width / 2;
    this.background.pivot.y = this.background.height / 2;
    this.gameContainer.addChildAt(this.background, 0);

    var animate = function() {
      window.requestAnimationFrame(animate);
      renderer.render(stage);
    }.bind(this);

    window.addEventListener("keydown", this._keyDown);
    window.addEventListener("keyup", this._keyUp);

    animate();
  },

  componentWillUnmount: function() {
    window.removeEventListener("keydown", this._keyDown);
    window.removeEventListener("keyup", this._keyUp);
  },

  render: function() {
    return <canvas style={{width: '100%', height: this.HEIGHT}}/>
  }
});
