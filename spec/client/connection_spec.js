var _ = require("lodash");
var Connection = require("../../js/client/connection");
var EventEmitter = require('events').EventEmitter;

describe("Connection", function() {
  describe("End to end connections", function() {
    var con1;
    var con2;

    beforeEach(function(done) {
      var negotiator1 = new EventEmitter();
      con1 = new Connection(negotiator1);
      var negotiator2 = new EventEmitter();
      con2 = new Connection(negotiator2);

      negotiator1.on("shareIceCandidate", function(id, candidate) {
        con2.handle("addIceCandidate", candidate);
      });

      negotiator2.on("shareIceCandidate", function(id, candidate) {
        con1.handle("addIceCandidate", candidate);
      });

      negotiator2.on("shareAnswer", function(id, answer) {
        con1.handle("acceptAnswer", answer);
      });

      negotiator1.on("shareOffer", function(id, offer) {
        con2.handle("receiveOffer", offer);
      });

      con1.handle("connect");
      con2.handle("connect");

      con1.handle("createOffer");

      con1.on("connected", function() {
        done();
      });
    });

    it("can send and receive simple messages", function(done) {
      con1.handle("sendMessage", "test");

      con2.on("receiveMessage", function(message) {
        expect(message).toEqual("test");
        done();
      });
    });

    it("can send and receive objects", function(done) {
      con1.handle("sendMessage", {foo: "bar"});

      con2.on("receiveMessage", function(message) {
        expect(message).toEqual({foo: "bar"});
        done();
      });
    });
  });
});
