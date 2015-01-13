var _ = require('underscore');
Machina = require('machina');

module.exports = Machina.Fsm.extend({
  initialState: "disconnected",

  initialize : function (adaptor, negotiator) {
    this.adaptor = adaptor;
    this.negotiator = negotiator;
  },

  setupChannel : function(channel) {
    this.channel = channel;
    this.channel.onopen = function() {
      this.transition("connected");
    }.bind(this);
    this.channel.onmessage = function(e) {
      this.handle("receiveMessage", e.data);
    }.bind(this);
  },

  error : function(e) {
    console.log('error');
    console.log(e);
  },

  states : {
    "disconnected" : {
      "connect" : function() {
        var that = this;
        this.connection = new this.adaptor.RTCPeerConnection(null);
        this.connection.onicecandidate = function(e) {
          if (e.candidate) {
            that.negotiator.handle("shareIceCandidate", that, e.candidate);
          }
        };
        this.negotiator.handle("connect", this);
      },
      "createOffer" : function() {
        var that = this;

        this.setupChannel(this.connection.createDataChannel("sendDataChannel", {reliable: false}));

        this.connection.createOffer(function(desc) {
          that.connection.setLocalDescription(desc, function() {
            that.negotiator.handle("shareOffer", desc);
          }, this.error);
        }, this.error);

        return 0;
      },
      "receiveOffer" : function(offerDesc) {
        var that = this;
        this.connection.ondatachannel = function (e) {
          that.setupChannel(e.channel);
        };

        this.connection.setRemoteDescription(offerDesc, function() {
          that.connection.createAnswer(function(answerDesc) {
            that.connection.setLocalDescription(answerDesc, function() {
              that.negotiator.handle("shareAnswer", answerDesc);
            }, this.error);
          }, this.error);
          that.transition("remoteDescriptionSet");
        }, this.error);

        return 0;
      },
      "acceptAnswer" : function(desc) {
        var that = this;
        this.connection.setRemoteDescription(desc, function() {
          that.negotiator.handle("acceptAnswer", that);
          that.transition("remoteDescriptionSet");
        }, this.error);
      },
      "addIceCandidate" : function() {
        this.deferUntilTransition("remoteDescriptionSet");
      },
      "sendMessage" : function() {
        this.deferUntilTransition("connected");
      },
    },

    "remoteDescriptionSet" : {
      "addIceCandidate" : function(candidate) {
        this.connection.addIceCandidate(candidate);
      },
      "sendMessage" : function() {
        this.deferUntilTransition("connected");
      }
    },

    "connected" : {
      "sendMessage" : function(data) {
        this.channel.send(data);
      },
      "receiveMessage" : function(data) {
        console.log(data);
      },
      "disconnect" : function() {
        this.channel.close();
        this.localConnection.close();
        this.localConnection = null;
      }
    }
  }
});
