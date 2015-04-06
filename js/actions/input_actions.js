var alt = require('../alt');

var W = 87;
var A = 65;
var S = 83;
var D = 68;

var forward = 0;
var rotation = 0;

function InputActions() {
}

InputActions.prototype.inputChange = function(keyCode, direction) {
  var newForward = forward;
  var newRotation = rotation;

  if (keyCode == W) {
    newForward = -1 * direction;
  } else if (keyCode == S) {
    newForward = 1 * direction;
  } else if (keyCode == A) {
    newRotation = 1 * direction;
  } else if (keyCode == D) {
    newRotation = -1 * direction;
  }


  if(newForward != forward || newRotation != rotation) {
    forward = newForward;
    rotation = newRotation;
    this.dispatch({
      forward: forward,
      rotation: rotation,
    });
  }
};

module.exports = alt.createActions(InputActions);
