var React = require('react');
var Lobby = require('./lobby.jsx');
var LobbyViewer = require('./lobby_viewer.jsx');
var LoadingScreen = require('./loading_screen.jsx');
var ConnectionStore = require('../stores/connection_store');

module.exports = React.createFactory(
  React.createClass({
    getInitialState: function() {
      return ConnectionStore.getState();
    },

    componentWillMount: function() {
      ConnectionStore.listen(this._onChange)
    },

    componentWillUnmount: function() {
      ConnectionStore.unlisten(this._onChange)
    },

    _onChange: function() {
      this.setState(ConnectionStore.getState())
    },

    render: function() {
      var page;
      if(this.state.connectionState == ConnectionStore.CONNECTED) {
        page = <Lobby />
      } else if (this.state.connectionState == ConnectionStore.CONNECTING) {
        page = <LoadingScreen />
      } else {
        page = <LobbyViewer defaultLobbies={this.props.lobbies}/>
      }

      return (
        <html>
          <link rel="stylesheet" href="css/foundation.css"/>
          <title>
            Peer Lobbies
          </title>

          <body>
            <div className="contain-to-grid sticky">
              <nav className="top-bar" data-topbar role="navigation" data-options="sticky_on: large">
                <ul className="title-area">
                  <li className="name">
                    <h1><a href="#"> Peer Lobbies </a></h1>
                  </li>
                </ul>
              </nav>
            </div>

            { page }

            <script type="text/javascript" src="/js/bundle.js"/>
          </body>
        </html>
      );
    }
  })
)
