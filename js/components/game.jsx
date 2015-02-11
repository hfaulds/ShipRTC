var React = require('react');

var _ = require('lodash');

var PlayerStore = require('../stores/player_store');

if(global.document) {
  var PIXI = require('pixi.js');
}

module.exports = React.createClass({
  WIDTH: 1000,
  HEIGHT: 600,
  stage: new PIXI.Stage(0x888888),
  gameContainer: new PIXI.DisplayObjectContainer(),

  getInitialState: function() {
    var players = PlayerStore.getState().players;

    var ships = _.map(players, function(player) {
      var ship = PIXI.Sprite.fromImage(player.sprite);
      ship.position.x = this.WIDTH / 2;
      ship.position.y = this.HEIGHT / 2;
      return ship;
    }.bind(this));

    return {players: players, ships: ships};
  },

  componentWillMount: function() {
    PlayerStore.listen(this._onChange)
  },

  componentWillUnmount: function() {
    PlayerStore.unlisten(this._onChange)
  },

  _onChange: function() {
    var players = PlayerStore.getState().players
    var newPlayers = _.slice(players, this.state.players.length - 1);

    var newShips = _.map(newPlayers, function(player) {
      var ship = PIXI.Sprite.fromImage(player.sprite);
      ship.pivot.x = ship.width / 2;
      ship.pivot.y = ship.height / 2;
      ship.position.x = this.renderer.width / 2;
      ship.position.y = this.renderer.height / 2;
      return ship;
    }.bind(this));

    _.each(newShips, function(ship) {
      this.gameContainer.addChild(ship);
    }.bind(this));

    this.setState({players: players, ships: _.union(this.state.ships, newShips)});
  },

  componentDidMount: function() {
    this.renderer = new PIXI.WebGLRenderer(this.WIDTH, this.HEIGHT, {
      view: this.getDOMNode()
    });

    var loader = new PIXI.AssetLoader([
      "images/PlayerShips/playerShip2_blue.png",
      "images/Backgrounds/darkPurple.png",
    ]);
    var background;
    var forward = 0;
    var rotation = 0;

    this.stage.addChild(this.gameContainer);

    window.addEventListener('keyup', function(e) {
      if (e.keyCode == 87) {
        forward = 0;
      } else if (e.keyCode == 83) {
        forward = 0;
      } else if (e.keyCode == 65) {
        rotation = 0;
      } else if (e.keyCode == 68) {
        rotation = 0;
      }
    }, false);
    window.addEventListener('keydown', function(e) {
      if (e.keyCode == 87) {
        forward = 1;
      } else if (e.keyCode == 83) {
        forward = -1;
      } else if (e.keyCode == 65) {
        rotation = -1;
      } else if (e.keyCode == 68) {
        rotation = 1;
      }
    }, false);

    var animate = function() {
      var ship = this.state.ships[0];
      var otherShips = _.slice(this.state.ships, 1);

      window.requestAnimationFrame(animate);

      this.renderer.render(this.stage);

      if(rotation != 0) {
        ship.rotation += rotation * Math.PI / 64;
      }
      if(forward != 0) {
        var movementDirection = new PIXI.Matrix();
        movementDirection.translate(0, forward * 5);
        movementDirection.rotate(ship.rotation);

        var movement = movementDirection.apply(new PIXI.Point());
        background.tilePosition.x += movement.x;
        background.tilePosition.y += movement.y;

        _.each(otherShips, function(otherShip) {
          otherShip.position.x += movement.x;
          otherShip.position.y += movement.y;
        });
      }
    }.bind(this);

    loader.onComplete = function() {
      var backgroundTexture = PIXI.Texture.fromImage("images/Backgrounds/darkPurple.png");
      background = new PIXI.TilingSprite(backgroundTexture, this.renderer.width, this.renderer.height);
      background.pivot.x = background.width / 2;
      background.pivot.y = background.height / 2;
      background.position.x = this.renderer.width / 2;
      background.position.y = this.renderer.height / 2;
      this.gameContainer.addChild(background);

      _.each(this.state.ships, function(ship) {
        ship.pivot.x = ship.width / 2;
        ship.pivot.y = ship.height / 2;
        this.gameContainer.addChild(ship);
      }.bind(this));

      window.requestAnimationFrame(animate);
    }.bind(this);

    loader.load();
  },

  render: function() {
    return <canvas id="canvas"/>;
  }
});
