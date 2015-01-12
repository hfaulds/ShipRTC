var _ = require('underscore');
Machina = require('machina');

module.exports = function() {
  return new Machina.Fsm({
    initialState: "disconnected",

    initialize: function() {
      this.candidatesForAnswerer = [];
    },

    states : {
      "disconnected" : {
        "connect" : function(con) {
          this.offererConId = con.createOffer();
          this.offererCon = con;
          this.transition("waitingForOffer");
        }
      },

      "waitingForOffer" : {
        "connect" : function(con) {
          this.answererCon = con;
        },
        "shareOffer" : function(offer) {
          this.offer = offer;
          this.transition("waitingForAnswerCreation");
        },
        "shareIceCandidate" : function(con, candidates) {
          if(con == this.offererCon) {
            this.candidatesForAnswerer.push(candidate);
          }
        },
      },

      "waitingForAnswerCreation" : {
        _onEnter: function() {
          if(this.answererCon) {
            this.answererConId = this.answererCon.receiveOffer(this.offer);
          }
        },
        "connect" : function(con) {
          this.answererConId = con.receiveOffer(this.offer);
          this.answererCon = con;
        },
        "shareAnswer" : function(answer) {
          this.answer = answer;
          this.transition("waitingForAnswerAccept");
        },
        "shareIceCandidate" : function(con, candidate) {
          if(con == this.offererCon) {
            this.candidatesForAnswerer.push(candidate);
          } else {
            this.offererCon.addIceCandidate(candidate, this.offererConId);
          }
        },
      },

      "waitingForAnswerAccept" : {
        _onEnter: function() {
          _.each(this.candidatesForAnswerer, function(candidate) {
            this.answererCon.addIceCandidate(candidate, this.answererConId);
          }.bind(this));
          this.candidatesForAnswerer = [];
          this.offererCon.acceptAnswer(this.answer, this.offererConId);
        },
        "acceptAnswer" : function(answer) {
          this.transition("waitingForIceCandidates");
        },
        "shareIceCandidate" : function(con, candidate) {
          if(con == this.offererCon) {
            this.answererCon.addIceCandidate(candidate, this.answererConId);
          } else {
            this.offererCon.addIceCandidate(candidate, this.offererConId);
          }
        },
      },

      "waitingForIceCandidates" : {
        _onEnter: function() {
          _.each(this.candidatesForAnswerer, function(candidate) {
            this.answererCon.addIceCandidate(candidate, this.answererConId);
          }.bind(this));
          this.candidatesForAnswerer = [];
        },
        "connected" : function(answer) {
          this.transition("connected");
        },
        "shareIceCandidate" : function(con, candidate) {
          if(con == this.offererCon) {
            this.answererCon.addIceCandidate(candidate, this.answererConId);
          } else {
            this.offererCon.addIceCandidate(candidate, this.offererConId);
          }
        },
      },

      "connected" : {
        _onEnter: function() {

        }
      }
    }
  });
};
