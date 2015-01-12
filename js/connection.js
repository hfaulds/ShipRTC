var _ = require('underscore');

function Connection(adaptor, negotiator) {
  this.adaptor = adaptor;
  this.negotiator = negotiator;

  this.cachedIceCandidates = [];
  this.bufferedMessagesOut = [];
  this.bufferedMessagesIn = [];
}

Connection.prototype.connect = function() {
  var servers = null, dataConstraint = null;

  var that = this;
  this.connection = new this.adaptor.RTCPeerConnection(servers);
  this.connection.onicecandidate = function(e) {
    if (e.candidate) {
      that.negotiator.handle("shareIceCandidate", that, e.candidate);
    }
  };
  this.negotiator.handle("connect", this);
};

Connection.prototype.createOffer = function() {
  var that = this;

  this.channel = this.connection.createDataChannel("sendDataChannel", {reliable: false});
  this.channel.onopen = this.onConnection.bind(this);
  this.channel.onmessage = this.onReceiveMessageCallback.bind(this);

  this.connection.createOffer(function(desc) {
    that.connection.setLocalDescription(desc, function() {
      that.negotiator.handle("shareOffer", desc);
    }, this.error);
  }, this.error);

  return 0;
};

Connection.prototype.receiveOffer = function(offerDesc) {
  var that = this;
  this.connection.ondatachannel = function (e) {
    that.channel = e.channel;
    that.channel.onopen = that.onConnection.bind(that);
    that.channel.onmessage = that.onReceiveMessageCallback.bind(that);
  };

  this.connection.setRemoteDescription(offerDesc, function() {
    that.handleCachedIceCandidates();
    that.connection.createAnswer(function(answerDesc) {
      that.connection.setLocalDescription(answerDesc, function() {
        that.negotiator.handle("shareAnswer", answerDesc);
      }, this.error);
    }, this.error);
  }, this.error);

  return 0;
};

Connection.prototype.acceptAnswer = function(desc) {
  var that = this;
  this.connection.setRemoteDescription(desc, function() {
    that.handleCachedIceCandidates();
    that.negotiator.handle("acceptAnswer", that);
  }, this.error);
};

Connection.prototype.handleCachedIceCandidates = function() {
  _.each(this.cachedIceCandidates, function(candidate) {
    this.connection.addIceCandidate(candidate);
  }.bind(this));
};

Connection.prototype.addIceCandidate = function(candidate) {
  if(this.connection.remoteDescription) {
    this.connection.addIceCandidate(candidate);
  } else {
    this.cachedIceCandidates.push(candidate);
  }
};

Connection.prototype.sendMsg = function(data) {
  if(this.channel && this.channel.readyState === 'open') {
    this.channel.send(data);
  } else {
    this.bufferedMessagesOut.push(data);
  }
};

Connection.prototype.closeDataChannels = function() {
  this.channel.close();
  this.localConnection.close();
  this.localConnection = null;
};

Connection.prototype.onConnection = function() {
  var that = this;
  _.each(this.bufferedMessagesOut, function(message) {
    that.sendMsg(message);
  });
  this.bufferedMessagesOut = [];
  this.negotiator.handle("connected");
};

Connection.prototype.onReceiveMessageCallback = function(e) {
  console.log(e.data);
  this.bufferedMessagesIn.push(e.data);
};

Connection.prototype.readMsgs = function() {
  var messages = this.bufferedMessagesIn;
  this.bufferedMessagesIn = [];
  return messages;
};

Connection.prototype.error = function() {
  console.log('error');
};

module.exports = Connection;
