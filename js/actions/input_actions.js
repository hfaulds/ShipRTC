var alt = require('../alt');
var ConnectionApiUtils = require('../utils/connection_api_utils');

var W = 87;
var A = 65;
var S = 83;
var D = 68;

var forward = 0;
var rotation = 0;

function InputActions() {
}

InputActions.prototype.inputChange = function(keyCode, direction) {

  if (keyCode == W) {
    forward = 1 * direction;
  } else if (keyCode == S) {
    forward = -1 * direction;
  } else if (keyCode == A) {
    rotation = 1 * direction;
  } else if (keyCode == D) {
    rotation = -1 * direction;
  }

  ConnectionApiUtils.handleInput({
    forward: forward,
    rotation: rotation,
  });

  this.dispatch();
};

module.exports = alt.createActions(InputActions);
