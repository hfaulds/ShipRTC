var _ = require("lodash");
var Negotiator = require("../../js/client/negotiator");
var EventEmitter = require('events').EventEmitter;

describe("Negotiator", function() {
  var negotiator;
  var fakeConnection;

  beforeEach(function() {
    fakeConnection = jasmine.createSpyObj('connection', ['emit']);
    negotiator = new Negotiator(fakeConnection, 0);
  });

  describe("#emit", function() {
    it("called connection.emit with id before arguments", function() {
      negotiator.emit('event', 'data');

      expect(fakeConnection.emit).toHaveBeenCalledWith('event', 0, 'data');
    });
  });
});
