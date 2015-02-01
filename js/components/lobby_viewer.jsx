var React = require('react');
var _ = require('underscore');

module.exports = React.createFactory(
  React.createClass({
    getInitialState: function() {
      if(this.props.lobbies) {
        return({lobbies: this.props.lobbies});
      } else {
        var domNode = document.querySelector("html");
        var lobbies = JSON.parse(domNode.dataset.lobbies)
        return({lobbies: lobbies});
      }
    },
    joinServer: function(lobbyId) {
      return function(e) {
        var Client = require("../client/client");
        var client = new Client(this.state.lobbyServerURL);
        client.on("connected", function() {
          client.handle('sendMessage', 'from client1');
        });
        client.handle('connectToServer', lobbyId);
      }.bind(this);
    },
    createServer: function() {
      var Server = require("../client/server");
      var server = new Server(this.state.lobbyServerURL);
      server.on("registered", function(lobbyId) {
      });
      server.handle("register");
    },
    render: function() {
      return(
        <html data-lobbies={JSON.stringify(this.state.lobbies)}>
          <link rel="stylesheet" href="css/foundation.css"/>

          <body>
            <div className="contain-to-grid sticky">
              <nav className="top-bar" data-topbar role="navigation" data-options="sticky_on: large">
                <ul className="title-area">
                  <li className="name">
                    <h1><a href="#">Top Bar Title </a></h1>
                  </li>
                </ul>
              </nav>
            </div>

            <div id="lobbies">
              {
                this.state.lobbies.map(function(lobby) {
                  return (
                    <div className="row" key={lobby}>
                      <div className="small-2 large-4 columns">
                        { lobby }
                      </div>
                      <div className="small-2 large-4 columns">
                        <button onClick={this.joinServer(lobby)}>
                          join
                        </button>
                      </div>
                    </div>
                  )
                }.bind(this))
              }
            </div>

            <div className="panel">
              <div className="row">
                <div className="small-2 large-4 columns">
                </div>
                <div className="small-2 large-4 columns">
                  <button onClick={this.createServer}>
                    create server
                  </button>
                </div>
              </div>
            </div>
          </body>

          <script type="text/javascript" src="/js/bundle.js"/>
        </html>
      );
    }
  })
);
