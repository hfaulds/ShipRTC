var React = require('react');

var _ = require('lodash');

var PlayerStore = require('../stores/player_store');
var InputActions = require('../actions/input_actions');

if(global.document) {
  var PIXI = require('pixi.js');
}

module.exports = React.createClass({
  WIDTH: 1000,
  HEIGHT: 600,
  ships: {},

  componentWillMount: function() {
    this.stage = new PIXI.Stage(0x888888),
    this.gameContainer = new PIXI.DisplayObjectContainer(),
    PlayerStore.listen(this._onChange)
  },

  componentWillUnmount: function() {
    PlayerStore.unlisten(this._onChange)
  },

  _onChange: function() {
    var players = PlayerStore.getState().players;
    var newPlayerIds = _.difference(_.keys(players),_.keys(this.ships));

    _.each(newPlayerIds, function(id) {
      var player = players[id];
      var ship = PIXI.Sprite.fromImage(player.sprite);
      ship.pivot.x = ship.width / 2;
      ship.pivot.y = ship.height / 2;

      this.ships[id] = ship;
      this.gameContainer.addChild(ship);
    }.bind(this));

    var removedPlayerIds = _.difference(_.keys(this.ships), _.keys(players));
    _.each(removedPlayerIds, function(id) {
      this.gameContainer.removeChild(this.ships[id]);
      delete this.ships[id];
    }.bind(this));

    _.each(players, function(player, id) {
      var ship = this.ships[id];
      ship.position.x = (this.renderer.width) / 2 - player.x;
      ship.position.y = (this.renderer.height) / 2 - player.y;
      ship.rotation = player.rotation
    }.bind(this));

    this.setState({players: players});
  },

  _keyDown: function(e) {
    InputActions.inputChange(e.keyCode, 1);
  },

  _keyUp: function(e) {
    InputActions.inputChange(e.keyCode, 0);
  },

  componentDidMount: function() {
    this.renderer = new PIXI.WebGLRenderer(this.WIDTH, this.HEIGHT, {
      view: this.getDOMNode()
    });

    var loader = new PIXI.AssetLoader([
      "images/PlayerShips/playerShip2_blue.png",
      "images/PlayerShips/playerShip2_red.png",
      "images/Backgrounds/darkPurple.png",
    ]);
    var backgroundTexture = PIXI.Texture.fromImage("images/Backgrounds/darkPurple.png");
    var background = new PIXI.TilingSprite(backgroundTexture, this.renderer.width, this.renderer.height);
    background.pivot.x = background.width / 2;
    background.pivot.y = background.height / 2;
    background.position.x = this.renderer.width / 2;
    background.position.y = this.renderer.height / 2;

    this.stage.addChild(this.gameContainer);
    this.gameContainer.addChild(background);

    var animate = function() {
      window.requestAnimationFrame(animate);
      this.renderer.render(this.stage);
    }.bind(this);

    loader.onComplete = function() {
      _.each(this.ships, function(ship) {
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
    return <canvas id="canvas" />;
  }
});
