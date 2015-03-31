var _ = require('lodash');
var Machina = require('machina');
var RTCPeerPromise = require("./rtc_peer_promise");

module.exports = Machina.Fsm.extend({
  initialState: "disconnected",

  initialize : function (negotiator, id) {
    this.negotiator = negotiator;
    this.id = id;

    this.receivedCount = 0;
    this.sentCount = 0;

    this.simulatedLatency = 0;
    this.simulatedPacketLoss = 0;
  },

  setupChannel : function(channel) {
    this.channel = channel;
    this.channel.onopen = function() {
      this.transition("connected");
      this.emit("connected", this.id);
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
      "connect" : function(id) {
        var that = this;
        this.connection = new RTCPeerPromise();
        this.connection.onIceCandidate(function(e) {
          if (e.candidate) {
            that.negotiator.emit("shareIceCandidate", e.candidate);
          }
        });
        this.negotiator.emit("startNegotiation", id);
      },
      "createOffer" : function() {
        var that = this;

        this.setupChannel(this.connection.createDataChannel("sendDataChannel", {reliable: false}));

        that.connection.createOffer().then(function(offer) {
          return that.connection.setLocalDescription(offer);
        }).then(function() {
          that.negotiator.emit("shareOffer", that.connection.getLocalDescription());
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
            that.negotiator.emit("shareAnswer", that.connection.getLocalDescription());
            that.transition("remoteDescriptionSet");
          }).catch(function(e) {
            that.error(e);
          });
      },
      "acceptAnswer" : function(desc) {
        var that = this;
        this.connection.setRemoteDescription(new RTCSessionDescription(desc)).
          then(function() {
            that.negotiator.emit("acceptAnswer");
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
        this.sentCount++;

        if(this.simulatedPacketLoss > 0) {
          if(Math.random() > this.simulatedPacketLoss / 100) return;
        }

        if(this.simulatedLatency > 0) {
          setTimeout(function() {
            if(this.channel.readyState === "open") {
              this.channel.send(JSON.stringify(data));
            }
          }.bind(this), this.simulatedLatency);
        } else {
          this.channel.send(JSON.stringify(data));
        }
      },
      "receiveMessage" : function(data) {
        this.receivedCount++;
        this.emit("receiveMessage", JSON.parse(data));
      },
      "disconnect" : function() {
        this.channel.close();
        this.transition("disconnected");
      }
    }
  },

  setSimulatedLatency : function(latency) {
    this.simulatedLatency = latency;
  },

  setSimulatedPacketLoss : function(packetLoss) {
    this.simulatedPacketLoss = packetLoss;
  },
});
