var Negotiator = require("./local_connection_negotiator");

var Connection = require("./connection");
var ConnectionAdaptor = require("./chrome_connection_adaptor");

var negotiator = new Negotiator();

var con1 = new Connection(ConnectionAdaptor, negotiator);
var con2 = new Connection(ConnectionAdaptor, negotiator);

con1.connect();
con2.connect();

con1.sendMsg('adsfasdf');
