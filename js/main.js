var LobbyServer = require("./lobby_server");
var Server = require("./server");
var Client = require("./client");

var lobbyServer = new LobbyServer();

var server = new Server(lobbyServer);
var client1 = new Client(lobbyServer);
var client2 = new Client(lobbyServer);

var lobbyId = server.register().lobbyId;
client1.connectToServer(lobbyId);
client2.connectToServer(lobbyId);

server.sendMessage('server broadcast');
client1.sendMessage('server receive client1');
client2.sendMessage('server receive client2');
