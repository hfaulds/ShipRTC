var React = require('react');

module.exports = React.createClass({
  render: function() {
    return(
      <div style={{padding: '100px'}}>
        <div className="row">
          <div className="text-center panel small-4 small-offset-4 columns">
            <h3>
              Loading
            </h3>
          </div>
        </div>
      </div>
    );
  }
});
