var _ = require('lodash');
Machina = require('machina');

module.exports = Machina.Fsm.extend({
  initialState: "waitingForOfferer",

  shareIceCandidate : function(con, candidate) {
    if(con == this.offererCon) {
      if(this.answererCon) {
        this.answererCon.emit("addIceCandidate", this.answererConId, candidate);
      } else {
        this.deferUntilTransition('waitingForAnswerCreation');
      }
    } else if(con == this.answererCon) {
      this.offererCon.emit("addIceCandidate", this.offererConId, candidate);
    }
  },

  states : {
    "waitingForOfferer" : {
      "connect" : function(con, id) {
        this.offererCon = con;
        this.offererConId = id;

        con.emit("createOffer", id);

        this.transition("waitingForOffer");
      }
    },

    "waitingForOffer" : {
      "connect" : function() {
        this.deferUntilTransition('waitingForAnswerer');
      },
      "shareOffer" : function(offer) {
        this.offer = offer;
        this.transition("waitingForAnswerer");
      },
      "shareIceCandidate" : function(con, candidate) {
        this.shareIceCandidate(con, candidate);
      }
    },

    "waitingForAnswerer" : {
      "connect" : function(con, id) {
        this.answererCon = con;
        this.answererConId = id;

        con.emit("receiveOffer", id, this.offer);

        this.transition("waitingForAnswerCreation");
      },
      "shareIceCandidate" : function(con, candidate) {
        this.shareIceCandidate(con, candidate);
      }
    },

    "waitingForAnswerCreation" : {
      "shareAnswer" : function(answer) {
        this.answer = answer;
        this.transition("waitingForAnswerAccept");
      },
      "shareIceCandidate" : function(con, candidate) {
        this.shareIceCandidate(con, candidate);
      }
    },

    "waitingForAnswerAccept" : {
      _onEnter: function() {
        this.offererCon.emit("acceptAnswer", this.offererConId, this.answer);
      },
      "acceptAnswer" : function() {
        this.transition("waitingForIceCandidates");
      },
      "shareIceCandidate" : function(con, candidate) {
        this.shareIceCandidate(con, candidate);
      }
    },

    "waitingForIceCandidates" : {
      "connected" : function(answer) {
        this.transition("connected");
      },
      "shareIceCandidate" : function(con, candidate) {
        this.shareIceCandidate(con, candidate);
      }
    },

    "connected" : {
      _onEnter: function() {

      }
    }
  }
});
