var LobbyServer = require("./lobby_server/lobby_server");
var lobbyServer = new LobbyServer();

var port = process.env.PORT || 9999;
console.log("LOBBY SERVER LISTINGS ON PORT: " + port);
lobbyServer.listen(port);
