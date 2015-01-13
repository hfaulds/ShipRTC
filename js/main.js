var Negotiator = require("./local_connection_negotiator");

var Connection = require("./connection");
var ConnectionAdaptor = require("./chrome_connection_adaptor");

var negotiator = new Negotiator();

var con1 = new Connection(ConnectionAdaptor, negotiator);
var con2 = new Connection(ConnectionAdaptor, negotiator);

con1.handle("connect");
con2.handle("connect");

con1.handle("sendMessage", 'adsfasdf');
