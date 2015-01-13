var _ = require('underscore');
Machina = require('machina');

module.exports = Machina.Fsm.extend({
  initialState: "waitingForOfferer",

  shareIceCandidate : function(con, candidate) {
    if(con == this.offererCon) {
      if(this.answererCon) {
        //this.answererCon.handle("addIceCandidate", this.offererConId, candidate);
        this.answererCon.handle("addIceCandidate", candidate);
      } else {
        this.deferUntilTransition('waitingForAnswerCreation');
      }
    } else if(con == this.answererCon) {
      //this.offererCon.handle("addIceCandidate", this.offererConId, candidate);
      this.offererCon.handle("addIceCandidate", candidate);
    }
  },

  states : {
    "waitingForOfferer" : {
      "connect" : function(con, id) {
        this.offererCon = con;
        this.offererConId = id;

        //con.handle("createOffer", id);
        con.handle("createOffer");

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

        //con.handle("receiveOffer", id, this.offer);
        con.handle("receiveOffer", this.offer);

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
        //this.offererCon.handle("acceptAnswer", this.offererConId, this.answer);
        this.offererCon.handle("acceptAnswer", this.answer);
      },
      "acceptAnswer" : function(answer) {
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
