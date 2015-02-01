var React = require('react');
var Lobby = require('./lobby.jsx');
var LobbyViewer = require('./lobby_viewer.jsx');
var LoadingScreen = require('./loading_screen.jsx');
var ConnectionStateStore = require('../stores/connection_state_store');

module.exports = React.createFactory(
  React.createClass({
    getInitialState: function() {
      return ConnectionStateStore.getState();
    },

    componentWillMount: function() {
      ConnectionStateStore.listen(this._onChange)
    },

    componentWillUnmount: function() {
      ConnectionStateStore.unlisten(this._onChange)
    },

    _onChange: function() {
      this.setState(ConnectionStateStore.getState())
    },

    render: function() {
      var page;
      if(this.state.connectionState == ConnectionStateStore.CONNECTED) {
        page = <Lobby />
      } else if (this.state.connectionState == ConnectionStateStore.CONNECTING) {
        page = <LoadingScreen />
      } else {
        page = <LobbyViewer lobbyServerUrl={this.props.lobbyServerUrl} lobbies={this.props.lobbies}/>
      }

      return (
        <html>
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

            { page }

            <script type="text/javascript" src="/js/bundle.js"/>
          </body>
        </html>
      );
    }
  })
)
