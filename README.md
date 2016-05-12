### Current State

The netcode is horribly broken. This was more of a learning experience for myself than anything else.

# ShipRTC

An experiment to create a multiplayer in-browser game with networking over WebRTC peer connections.

## Server

### Simple HTTP server for hosting the game assets

Overview:
- Browserify to share javascript assets between client and server
- React server-side rendering
- Alt-js for a flux implementation

### Lobby Browser

Keep track of open games. All communication with the client is done using websockets.

### WebRTC Signalling server

The server keeps a track of all available peers as part of the lobby browser. In order for peers to connect they need to share information before they can talk to each other further details can be found at (https://www.w3.org/TR/webrtc/#simple-peer-to-peer-example).

## Client

Uses React and WebGL via PixiJS and react-pixi. Physics provided by matterjs.
