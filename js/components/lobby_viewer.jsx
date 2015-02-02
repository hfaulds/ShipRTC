var React = require('react');
var _ = require('underscore');
var LobbyStore = require('../stores/lobby_store');
var LobbyActions = require('../actions/lobby_actions');
var ConnectionStateActions = require('../actions/connection_state_actions');

module.exports = React.createFactory(
  React.createClass({
    getInitialState: function() {
      ConnectionStateActions.setLobbyServerURL(this.props.lobbyServerURL);
      if(this.props.lobbies) {
        return({lobbies: this.props.lobbies});
      } else {
        return LobbyStore.getState();
      }
    },

    componentWillMount: function() {
      LobbyStore.listen(this._onChange)
      LobbyActions.refreshLobbies();
    },

    componentWillUnmount: function() {
      LobbyStore.unlisten(this._onChange)
    },

    _onChange: function() {
      this.setState(LobbyStore.getState())
      setTimeout(function() {
        LobbyActions.refreshLobbies();
      }, 1000);
    },

    joinLobby: function(lobbyId) {
      var ConnectionStateActions = require('../actions/connection_state_actions');
      return function(e) {
        ConnectionStateActions.joinLobby(lobbyId);
      }.bind(this);
    },

    createLobby: function() {
      ConnectionStateActions.createLobby();
    },

    render: function() {
      return(
        <div>
          <div id="lobbies" data-lobbies={JSON.stringify(this.state.lobbies)}>
            {
              this.state.lobbies.map(function(lobby) {
                return (
                  <div className="row" key={lobby}>
                    <div className="small-2 large-4 columns">
                      { lobby }
                    </div>
                    <div className="small-2 large-4 columns">
                      <button onClick={this.joinLobby(lobby)}>
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
                <button onClick={this.createLobby}>
                  create server
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  })
);
