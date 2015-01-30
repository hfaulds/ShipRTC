var Server = require("./client/server");
var Client = require("./client/client");

var lobbyServerURL = "http://localhost:9999";

var server = new Server(lobbyServerURL);
var client1 = new Client(lobbyServerURL);
var client2 = new Client(lobbyServerURL);

server.register(0);
setTimeout(function() {
  client1.connectToServer(0);
  client2.connectToServer(0);
}, 100);

setTimeout(function() {
  server.sendMessage('from server');
  client1.sendMessage('from client1');
  client2.sendMessage('from client2');
}, 500);

