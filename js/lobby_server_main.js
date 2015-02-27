var LobbyServer = require("./lobby_server/lobby_server");
var lobbyServer = new LobbyServer();
lobbyServer.listen(process.env.PORT || 9999);
