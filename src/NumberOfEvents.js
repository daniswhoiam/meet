import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NumberOfEvents extends Component {
  state = {
    numberSetting: this.props.eventNumber
  };

  handleNumberSetting = event => {
    const newValue = event.target.value;
    this.setState({
      numberSetting: newValue
    });
    this.props.updateEvents(null, newValue);
  };

  render() {
    return(
      <input 
        className="event-number-input"
        value={this.state.numberSetting}
        onChange={this.handleNumberSetting}
        type="number"
      />
    );
  }
}

NumberOfEvents.propTypes = {
  eventNumber: PropTypes.number.isRequired,
  updateEvents: PropTypes.func.isRequired
}

export default NumberOfEvents;