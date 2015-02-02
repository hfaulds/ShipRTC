var React = require('react');
var _ = require('lodash');
var LobbyStore = require('../stores/lobby_store');
var LobbyActions = require('../actions/lobby_actions');
var ConnectionActions = require('../actions/connection_actions');

module.exports = React.createFactory(
  React.createClass({
    getInitialState: function() {
      if(this.props.lobbies) {
        return({lobbies: this.props.lobbies});
      } else {
        var domNode = document.getElementById('lobbies');
        var lobbies = JSON.parse(domNode.dataset.lobbies);
        return({lobbies: lobbies});
      }
    },

    componentWillMount: function() {
      LobbyStore.listen(this._onChange)
    },

    componentDidMount: function() {
      LobbyActions.refreshLobbies();
    },

    componentWillUnmount: function() {
      LobbyStore.unlisten(this._onChange)
    },

    _onChange: function() {
      this.setState(LobbyStore.getState())
      requestAnimationFrame(function() {
        setTimeout(function() {
          LobbyActions.refreshLobbies();
        }, 5000);
      });
    },

    joinLobby: function(lobbyId) {
      return function(e) {
        ConnectionActions.joinLobby(lobbyId);
      }.bind(this);
    },

    createLobby: function() {
      ConnectionActions.createLobby();
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
  })
);
