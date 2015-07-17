var React = require('react');
var _ = require('lodash');
var Game = require('./game.jsx');

var GameSettingsStore = require('../stores/game_settings_store')

var ConnectionActions = require('../actions/connection_actions');
var GameSettingsActions = require('../actions/game_settings_actions');

var ENTER_KEY_CODE = 13;

module.exports = React.createClass({
  getInitialState: function() {
    return GameSettingsStore.getState();
  },

  componentWillMount: function() {
    GameSettingsStore.listen(this._onChange);
  },

  componentWillUnmount: function() {
    GameSettingsStore.listen(this._onChange);
  },

  _onChange: function() {
    this.setState(GameSettingsStore.getState());
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
              { this.state.simulatedLatency } ms

              <h6> Simulated Packet Loss </h6>
              <input type="range" min="0" max="15" step="1"
                value={this.state.simulatedPacketLoss}
                onChange={this._setSimulatedPacketLoss}/>
              { this.state.simulatedPacketLoss } %

              <h6> Client Prediction </h6>
              <input type="checkbox"
                checked={this.state.clientPrediction}
                onChange={this._setClientPrediction} />
            </div>
          </div>

        </div>
      </div>
    );
  }
});
