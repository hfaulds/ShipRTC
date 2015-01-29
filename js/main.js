var Server = require("./server");
var Client = require("./client");

var lobbyServerURL = "http://localhost:9999";

var server = new Server(lobbyServerURL);
var client1 = new Client(lobbyServerURL);
var client2 = new Client(lobbyServerURL);

var lobbyId = server.register();
//wait
//client1.connectToServer(lobbyId);
//client2.connectToServer(lobbyId);

//server.sendMessage('server broadcast');
//client1.sendMessage('server receive client1');
//client2.sendMessage('server receive client2');
