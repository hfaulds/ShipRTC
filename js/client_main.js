var Server = require("./client/server");
var Client = require("./client/client");

var lobbyServerURL = "http://localhost:9999";

var server = new Server(lobbyServerURL);
var client1 = new Client(lobbyServerURL);
var client2 = new Client(lobbyServerURL);

server.on("registered", function(lobbyId) {
  console.log('server registered');
  client1.handle('connectToServer', lobbyId);
  client2.handle('connectToServer', lobbyId);
});

client1.on("connected", function() {
  client1.handle('sendMessage', 'from client1');
  server.handle('sendMessage', 'from server');
});

client2.on("connected", function() {
  client2.handle('sendMessage', 'from client2');
  server.handle('sendMessage', 'from server');
});

server.handle("register");
