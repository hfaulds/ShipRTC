var React = require('react');
var _ = require('lodash');

var Lobby = require('./lobby.jsx');
var LobbyBrowser = require('./lobby_browser.jsx');
var LoadingScreen = require('./loading_screen.jsx');

var ConnectionStore = require('../stores/connection_store');

module.exports = React.createFactory(
  React.createClass({
    getInitialState: function() {
      return _.merge(
        ConnectionStore.getState(),
        {page: <LobbyBrowser defaultLobbies={this.props.lobbies}/>}
      );
    },

    componentWillMount: function() {
      ConnectionStore.listen(this._onChange)
    },

    componentWillUnmount: function() {
      ConnectionStore.unlisten(this._onChange)
    },

    _onChange: function() {
      var connectionState = ConnectionStore.getState().connectionState;

      var page;
      if(connectionState == ConnectionStore.CONNECTED) {
        page = <Lobby />;
      } else if (connectionState == ConnectionStore.CONNECTING) {
        page = <LoadingScreen />;
      } else {
        page = <LobbyBrowser defaultLobbies={this.props.lobbies}/>;
      }

      this.setState({page: page})
    },

    render: function() {
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

            { this.state.page }

            <script type="text/javascript" src="/js/bundle.js"/>
          </body>
        </html>
      );
    }
  })
)

