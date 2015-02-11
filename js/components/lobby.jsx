var React = require('react');
var _ = require('lodash');
var Game = require('./game.jsx');

var MessageStore = require('../stores/message_store')

var ConnectionActions = require('../actions/connection_actions');

var ENTER_KEY_CODE = 13;

module.exports = React.createClass({
  getInitialState: function() {
    return _.merge(
      MessageStore.getState(),
      { message: '' }
    );
  },

  componentWillMount: function() {
    MessageStore.listen(this._onChange);
  },

  componentWillUnmount: function() {
    MessageStore.unlisten(this._onChange);
  },

  _onChange: function() {
    this.setState(MessageStore.getState())
  },

  _sendMessage: function(e) {
    if(this.state.message.length > 0) {
      ConnectionActions.sendMessage(this.state.message);
      this.setState({message: ''});
    }
    e.preventDefault();
  },

  _changeMessage: function(e, value) {
    if(!e.keyCode) {
      this.setState({message: event.target.value});
    } else if (e.keyCode === ENTER_KEY_CODE) {
      ConnectionActions.sendMessage(this.state.message);
      this.setState({message: ''});
      e.preventDefault();
    }
  },

  render: function() {
    return(
      <div style={{padding: '100px'}}>
        <Game/>

        <div className="panel">
          {
            this.state.messages.map(function(message) {
              return(
                <div className="row" key={message.sender + message.id}>
                  <div className="small-1 large-1 columns">
                    { message.sender }
                  </div>
                  <div className="small-2 large-4 columns">
                    { message.body }
                  </div>
                </div>
              )
            })
          }
        </div>

        <div className="panel">
          <div className="row">
            <form>
              <div className="small-2 large-4 columns">
                <textarea
                  value={this.state.message}
                  onKeyDown={this._changeMessage}
                  onChange={this._changeMessage}
                />
              </div>
              <div className="small-2 large-4 columns">
                <button onClick={this._sendMessage}>
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
