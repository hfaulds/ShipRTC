var Bluebird = require("bluebird");

var SERVERS =  [
  {url:'stun:stun01.sipphone.com'},
  {url:'stun:stun.ekiga.net'},
  {url:'stun:stun.fwdnet.net'},
  {url:'stun:stun.ideasip.com'},
  {url:'stun:stun.iptel.org'},
  {url:'stun:stun.rixtelecom.se'},
  {url:'stun:stun.schlund.de'},
  {url:'stun:stun.l.google.com:19302'},
  {url:'stun:stun1.l.google.com:19302'},
  {url:'stun:stun2.l.google.com:19302'},
  {url:'stun:stun3.l.google.com:19302'},
  {url:'stun:stun4.l.google.com:19302'},
  {url:'stun:stunserver.org'},
  {url:'stun:stun.softjoys.com'},
  {url:'stun:stun.voiparound.com'},
  {url:'stun:stun.voipbuster.com'},
  {url:'stun:stun.voipstunt.com'},
  {url:'stun:stun.voxgratia.org'},
  {url:'stun:stun.xten.com'},
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
