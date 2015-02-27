var Bluebird = require("bluebird");

var SERVERS =  [
  {url: "stun:stun.turnservers.com:3478"},
  {url: "turn:85.25.243.74:3478?transport=udp", "username": "EeangVrudNzW", "credential": "5a32994dbdc81331d414664bdeb1345e" },
  {url: "turn:85.25.243.74:3478?transport=tcp", "username": "EeangVrudNzW", "credential": "5a32994dbdc81331d414664bdeb1345e" }
];

var CONFIG = {iceServers: SERVERS};

function RTCPeerPromise() {
  if(global.webkitRTCPeerConnection) {
    this.connection = new webkitRTCPeerConnection(CONFIG);
  } else if(global.mozRTCPeerConnection) {
    this.connection = new mozRTCPeerConnection(CONFIG);
  }
}

RTCPeerPromise.prototype.onIceCandidate = function(callback) {
  this.connection.onicecandidate = callback;
};

RTCPeerPromise.prototype.onDataChannel = function(callback) {
  this.connection.ondatachannel = callback;
};


RTCPeerPromise.prototype.getLocalDescription = function() {
  return this.connection.localDescription;
};


RTCPeerPromise.prototype.createDataChannel = function(name, opts) {
  return this.connection.createDataChannel(name, opts);
};


RTCPeerPromise.prototype.createOffer = function() {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.connection.createOffer(resolve, reject);
  });
};

RTCPeerPromise.prototype.setLocalDescription = function(desc) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.connection.setLocalDescription(desc, resolve, reject);
  });
};

RTCPeerPromise.prototype.setRemoteDescription = function(desc) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.connection.setRemoteDescription(desc, resolve, reject);
  });
};

RTCPeerPromise.prototype.createAnswer = function() {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.connection.createAnswer(resolve, reject);
  });
};


RTCPeerPromise.prototype.addIceCandidate = function(candidate) {
  this.connection.addIceCandidate(candidate);
};

module.exports = RTCPeerPromise;
