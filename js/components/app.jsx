var React = require('react');
var _ = require('lodash');

var Lobby = require('./lobby.jsx');
var LobbyBrowser = require('./lobby_browser.jsx');
var LoadingScreen = require('./loading_screen.jsx');

var ConnectionStore = require('../stores/connection_store');
var ImageStore = require('../stores/image_store');

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
      ImageStore.listen(this._onChange)
    },

    componentWillUnmount: function() {
      ConnectionStore.unlisten(this._onChange)
      ImageStore.unlisten(this._onChange)
    },

    _onChange: function() {
      var connectionState = ConnectionStore.getState().connectionState;

      var page;
      if (connectionState == ConnectionStore.CONNECTING) {
        page = <LoadingScreen />;
      } else if(!ImageStore.getState().imagesLoaded) {
        page = <LoadingScreen />;
      } else if(connectionState == ConnectionStore.CONNECTED) {
        page = <Lobby />;
      } else {
        page = <LobbyBrowser defaultLobbies={this.props.lobbies}/>;
      }

      this.setState({page: page})
    },

    render: function() {
      return (
        <div>
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

        </div>
      );
    }
  })
)

