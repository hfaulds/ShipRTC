var React = require('react');
var MessageStore = require('../stores/message_store')
var ConnectionActions = require('../actions/connection_actions');

module.exports = React.createClass({
  getInitialState: function() {
    return MessageStore.getState();
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

  sendMessage: function(e) {
    ConnectionActions.sendMessage('foo');
    e.preventDefault();
  },

  render: function() {
    return(
      <div style={{padding: '100px'}}>
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
                <textarea>
                </textarea>
              </div>
              <div className="small-2 large-4 columns">
                <button onClick={this.sendMessage}>
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
