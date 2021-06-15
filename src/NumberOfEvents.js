import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ErrorAlert } from './Alert';

class NumberOfEvents extends Component {
  state = {
    numberSetting: this.props.eventNumber
  };

  handleNumberSetting = event => {
    const newValue = event.target.value;

    if (newValue <= 0 || newValue >= 100) {
      this.setState({
        numberSetting: newValue,
        errorText: 'Please enter a valid number of events to show.'
      });
    } else {
      this.setState({
        numberSetting: newValue,
        errorText: ''
      });
      this.props.updateEvents(null, newValue);
    }    
  };

  render() {
    return(
      <div className="NumberOfEvents">
        <input 
          className="event-number-input"
          value={this.state.numberSetting}
          onChange={this.handleNumberSetting}
          type="number"
        />
        <ErrorAlert text={this.state.errorText} />
      </div>
    );
  }
}

NumberOfEvents.propTypes = {
  eventNumber: PropTypes.number.isRequired,
  updateEvents: PropTypes.func.isRequired
}

export default NumberOfEvents;