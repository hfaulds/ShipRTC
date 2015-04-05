var React = require('react');

var _ = require('lodash');

var PlayerStore = require('../stores/player_store');
var ImageStore = require('../stores/image_store');

var InputActions = require('../actions/input_actions');

var HEIGHT = 600;
var WIDTH = 720;

module.exports = React.createClass({
  _keyDown: function(e) {
    InputActions.inputChange(e.keyCode, 1);
  },

  _keyUp: function(e) {
    InputActions.inputChange(e.keyCode, 0);
  },

  getInitialState: function() {
    return PlayerStore.getState();
  },

  _onChange: function() {
    this.setState(PlayerStore.getState());
  },

  componentWillMount: function() {
    PlayerStore.listen(this._onChange)
  },

  componentDidMount: function() {
    window.addEventListener("keydown", this._keyDown);
    window.addEventListener("keyup", this._keyUp);
  },

  componentWillUnmount: function() {
    PlayerStore.unlisten(this._onChange)
    window.removeEventListener("keydown", this._keyDown);
    window.removeEventListener("keyup", this._keyUp);
  },

  render: function() {
    var ReactPIXI = require("react-pixi");
    var Stage = ReactPIXI.Stage;
    var TilingSprite = ReactPIXI.TilingSprite;
    var Sprite = ReactPIXI.Sprite;
    var DisplayObjectContainer = ReactPIXI.DisplayObjectContainer;

    var ImageStore = require('../stores/image_store');
    var shipTexture = ImageStore.getState().textures["images/PlayerShips/playerShip2_red.png"];

    return (
      <Stage width={WIDTH} height={HEIGHT}>
        <TilingSprite
          width={WIDTH}
          height={HEIGHT}
          image="images/Backgrounds/darkPurple.png"
          tilePosition={{
            x: -this.state.players.self.x,
            y: -this.state.players.self.y,
          }}
        />

        <DisplayObjectContainer
          x={WIDTH/2}
          y={HEIGHT/2}
        >
          {
            _.map(this.state.players, function(ship) {
              return <Sprite
                image="images/PlayerShips/playerShip2_red.png"
                pivot={{
                  x: shipTexture.width/2,
                  y: shipTexture.height/2
                }}
                position={{
                  x: ship.x - this.state.players.self.x,
                  y: ship.y - this.state.players.self.y
                }}
                rotation={ship.rotation}
              />
            }.bind(this))
          }
        </DisplayObjectContainer>
      </Stage>
    )
  }
});
