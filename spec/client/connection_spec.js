var _ = require("lodash");
var Connection = require("../../js/client/connection");

describe("ConnectionPool", function() {
  describe("End to end connections", function() {
    var con1;
    var con2;

    beforeEach(function(done) {
      con1 =  new Connection();
      con2 =  new Connection();

      con1.on("shareIceCandidate", function(id, candidate) {
        con2.handle("addIceCandidate", candidate);
      });

      con2.on("shareIceCandidate", function(id, candidate) {
        con1.handle("addIceCandidate", candidate);
      });

      con2.on("shareAnswer", function(id, answer) {
        con1.handle("acceptAnswer", answer);
      });

      con1.on("shareOffer", function(id, offer) {
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
