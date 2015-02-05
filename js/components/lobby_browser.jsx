var React = require('react');
var _ = require('lodash');
var LobbyStore = require('../stores/lobby_store');
var LobbyActions = require('../actions/lobby_actions');
var ConnectionActions = require('../actions/connection_actions');

module.exports = React.createClass({
  getInitialState: function() {
    if(this.props.defaultLobbies) {
      return {lobbies: this.props.defaultLobbies};
    } else {
      return LobbyStore.getState();
    }
  },

  componentWillMount: function() {
    LobbyStore.listen(this._onChange)
  },

  componentWillUnmount: function() {
    LobbyActions.cancelRefresh();
    LobbyStore.unlisten(this._onChange)
    if(this.timeout) {
      clearTimeout(this.timeout);
    }
  },

  _onChange: function() {
    this.setState(LobbyStore.getState())
    var that = this;
    this.timeout = setTimeout(function() {
      this.timeout = undefined;
      LobbyActions.refreshLobbies();
    }, 5000);
  },

  joinLobby: function(lobbyId) {
    return function(e) {
      ConnectionActions.joinLobby(lobbyId);
      e.preventDefault();
    }.bind(this);
  },

  createLobby: function(e) {
    ConnectionActions.createLobby();
    e.preventDefault();
  },

  render: function() {
    return(
      <div style={{padding: '100px'}}>
      <div id="lobbies" data-lobbies={JSON.stringify(this.state.lobbies)}>
      <h1> Lobbies </h1>
      {
        <table style={{width: '100%'}}>
        <tbody>
        {
          this.state.lobbies.map(function(lobby) {
            return (
              <tr key={lobby}>
              <td>
              { lobby }
              </td>
              <td>
              <button onClick={this.joinLobby(lobby)}>
              join
              </button>
              </td>
              </tr>
            )
          }.bind(this))
        }
        </tbody>
        </table>
      }
      </div>

      <div className="panel">
      <div className="row">
      <div className="small-2 large-4 columns">
      </div>
      <div className="small-2 large-4 columns">
      <button onClick={this.createLobby}>
      create server
      </button>
      </div>
      </div>
      </div>
      </div>
    );
  }
});
