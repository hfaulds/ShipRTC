var _ = require('underscore');
Machina = require('machina');

module.exports = function() {
  return new Machina.Fsm({
    initialState: "waitingForOfferer",

    shareIceCandidate : function(con, candidate) {
      if(con == this.offererCon) {
        if(this.answererCon) {
          this.answererCon.addIceCandidate(candidate, this.answererConId);
        } else {
          this.deferUntilTransition('waitingForAnswerer');
        }
      } else if(con == this.answererCon) {
        this.offererCon.addIceCandidate(candidate, this.offererConId);
      }
    },

    states : {
      "waitingForOfferer" : {
        "connect" : function(con) {
          this.offererConId = con.createOffer();
          this.offererCon = con;
          this.transition("waitingForOffer");
        }
      },

      "waitingForOffer" : {
        "connect" : function(con) {
          this.deferUntilTransition('waitingForAnswerer');
        },
        "shareOffer" : function(offer) {
          this.offer = offer;
          this.transition("waitingForAnswerer");
        },
      },

      "waitingForAnswerer" : {
        "connect" : function(con) {
          this.answererCon = con;
          this.answererConId = con.receiveOffer(this.offer);
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
          this.offererCon.acceptAnswer(this.answer, this.offererConId);
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
};
