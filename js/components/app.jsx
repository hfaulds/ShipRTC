var React = require('react');
var LobbyViewer = require('./lobby_viewer.jsx');
var LoadingScreen = require('./loading_screen.jsx');
var ConnectionStateStore = {
  DISCONNECTED: 1,
  CONNECTING: 2,
  CONNECTED: 3,
};

module.exports = React.createFactory(
  React.createClass({
    getInitialState: function() {
      return({
        connectionState: ConnectionStateStore.DISCONNECTED,
      })
    },
    render: function() {
      var page;
      if(this.state.connectionState == ConnectionStateStore.CONNECTED) {
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
