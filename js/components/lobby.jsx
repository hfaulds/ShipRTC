var React = require('react');
var _ = require('lodash');
var Game = require('./game.jsx');

var MessageStore = require('../stores/message_store')
var GameSettingsStore = require('../stores/game_settings_store')

var ConnectionActions = require('../actions/connection_actions');
var GameSettingsActions = require('../actions/game_settings_actions');

var ENTER_KEY_CODE = 13;

module.exports = React.createClass({
  getInitialState: function() {
    return _.merge(
      MessageStore.getState(),
      GameSettingsStore.getState(),
      { message: '' }
    );
  },

  componentWillMount: function() {
    MessageStore.listen(this._onChange);
    GameSettingsStore.listen(this._onChange);
  },

  componentWillUnmount: function() {
    MessageStore.unlisten(this._onChange);
    GameSettingsStore.listen(this._onChange);
  },

  _onChange: function() {
    this.setState(MessageStore.getState());
    this.setState(GameSettingsStore.getState());
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

  _setSimulatedLatency: function(e) {
    GameSettingsActions.setSimulatedLatency(parseInt(e.target.value));
  },

  _setSimulatedPacketLoss: function(e) {
    GameSettingsActions.setSimulatedPacketLoss(parseInt(e.target.value));
  },

  _setClientPrediction: function(e) {
    GameSettingsActions.toggleClientPrediction(e.target.checked);
  },

  render: function() {
    return(
      <div style={{padding: '100px 0px'}}>
        <div className="row">
          <div className="large-9 columns">
            <Game/>
          </div>
          <div className="large-3 columns">
            <div className="panel" style={{height:"600"}}>
              <h6> Simulated Latency </h6>
              <input type="range" min="0" max="500" step="10"
                value={this.state.simulatedLatency}
                onChange={this._setSimulatedLatency}/>
              { this.state.simulatedLatency }

              <h6> Simulated Packet Loss </h6>
              <input type="range" min="0" max="15" step="1"
                value={this.state.simulatedPacketLoss}
                onChange={this._setSimulatedPacketLoss}/>
              { this.state.simulatedPacketLoss }

              <h6> Client Prediction </h6>
              <input type="checkbox"
                checked={this.state.clientPrediction}
                onChange={this._setClientPrediction} />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="large-12 columns">
            <div className="panel">
              {
                this.state.messages.map(function(message) {
                  return(
                    <div className="row" key={message.sender + message.id}>
                      <div className="large-1 columns">
                        { message.sender }
                      </div>
                      <div className="large-4 columns">
                        { message.body }
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>

        <div className="row">
          <div className="large-12 columns">
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
        </div>
      </div>
      );
    }
  });
