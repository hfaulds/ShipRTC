var _ = require('underscore');
var Bluebird = require("bluebird");
var Machina = require('machina');
var ConnectionAdaptor = require("./chrome_connection_adaptor");

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
        this.connection = Bluebird.promisifyAll(new ConnectionAdaptor.RTCPeerConnection(null));
        this.connection.onicecandidate = function(e) {
          if (e.candidate) {
            that.negotiator.emit("shareIceCandidate", that.negotiatorId, e.candidate);
          }
        };
        this.negotiator.emit("startNegotiation", this.negotiatorId, this.id);
        return this.id;
      },
      "createOffer" : function() {
        var that = this;

        this.setupChannel(this.connection.createDataChannel("sendDataChannel", {reliable: false}));

        this.connection.createOffer(function(desc) {
          that.connection.setLocalDescriptionAsync(desc).
          then(function() {
            that.negotiator.emit("shareOffer", that.negotiatorId, desc);
          });
        });
      },
      "receiveOffer" : function(offerDesc) {
        var that = this;
        this.connection.ondatachannel = function (e) {
          that.setupChannel(e.channel);
        };

        this.connection.
          setRemoteDescriptionAsync(new RTCSessionDescription(offerDesc)).
          then(function() {
          that.connection.createAnswer(function(answerDesc) {
            that.connection.setLocalDescriptionAsync(answerDesc).then(function() {
              that.negotiator.emit("shareAnswer", that.negotiatorId, that.connection.localDescription);
              that.transition("remoteDescriptionSet");
            });
          });
        });
      },
      "acceptAnswer" : function(desc) {
        var that = this;
        this.connection.setRemoteDescription(new RTCSessionDescription(desc), function() {
          that.negotiator.emit("acceptAnswer", that.negotiatorId);
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
        this.connection.addIceCandidate(new RTCIceCandidate(candidate));
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
