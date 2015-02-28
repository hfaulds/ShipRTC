var _ = require('lodash');
var Machina = require('machina');
var RTCPeerPromise = require("./rtc_peer_promise");

module.exports = Machina.Fsm.extend({
  initialState: "disconnected",

  initialize : function (_, id, negotiatorId, negotiator) {
    this.id = id;
    this.negotiatorId = negotiatorId;
    this.negotiator = negotiator;
  },

  setupChannel : function(channel) {
    this.channel = channel;
    this.channel.onopen = function() {
      this.transition("connected");
      this.emit("connected");
    }.bind(this);
    this.channel.onclose = function(e) {
      this.handle("disconnect");
      this.emit("disconnected");
    }.bind(this);
    this.channel.onerror = function(e) {
      this.handle("disconnect");
      this.emit("error");
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
        this.connection = new RTCPeerPromise();
        this.connection.onIceCandidate(function(e) {
          if (e.candidate) {
            that.negotiator.emit("shareIceCandidate", that.negotiatorId, e.candidate);
          }
        });
        this.negotiator.emit("startNegotiation", this.negotiatorId, this.id);
        return this.id;
      },
      "createOffer" : function() {
        var that = this;

        this.setupChannel(this.connection.createDataChannel("sendDataChannel", {reliable: false}));

        that.connection.createOffer().then(function(offer) {
          return that.connection.setLocalDescription(offer);
        }).then(function() {
          that.negotiator.emit("shareOffer", that.negotiatorId, that.connection.getLocalDescription());
        }).catch(function(e) {
          that.error(e);
        });
      },
      "receiveOffer" : function(offerDesc) {
        var that = this;
        this.connection.onDataChannel(function (e) {
          that.setupChannel(e.channel);
        });

        this.connection.
          setRemoteDescription(new RTCSessionDescription(offerDesc)).
          then(function() {
            return that.connection.createAnswer();
          }).then(function(answerDesc) {
            return that.connection.setLocalDescription(answerDesc);
          }).then(function() {
            that.negotiator.emit("shareAnswer", that.negotiatorId, that.connection.getLocalDescription());
            that.transition("remoteDescriptionSet");
          }).catch(function(e) {
            that.error(e);
          });
      },
      "acceptAnswer" : function(desc) {
        var that = this;
        this.connection.setRemoteDescription(new RTCSessionDescription(desc)).
          then(function() {
            that.negotiator.emit("acceptAnswer", that.negotiatorId);
            that.transition("remoteDescriptionSet");
          }).catch(function(e) {
            that.error(e);
          });
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
        this.connection.addIceCandidate(new RTCIceCandidate(candidate));
      },
      "sendMessage" : function() {
        this.deferUntilTransition("connected");
      }
    },

    "connected" : {
      "sendMessage" : function(data) {
        this.channel.send(JSON.stringify(data));
      },
      "receiveMessage" : function(data) {
        this.emit("receiveMessage", JSON.parse(data));
      },
      "disconnect" : function() {
        this.channel.close();
        this.transition("disconnected");
      }
    }
  }
});
