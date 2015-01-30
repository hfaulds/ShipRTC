var Bluebird = require("bluebird");
Bluebird.promisifyAll(Object.getPrototypeOf(new webkitRTCPeerConnection(null)));

webkitRTCPeerConnection.prototype.createOfferAsync = function() {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.createOffer(resolve, reject);
  });
};

webkitRTCPeerConnection.prototype.createAnswerAsync = function() {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.createAnswer(resolve, reject);
  });
};

module.exports = {
  RTCPeerConnection: webkitRTCPeerConnection
};
