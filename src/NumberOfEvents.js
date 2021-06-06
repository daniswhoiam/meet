import React, { Component } from 'react';

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

export default NumberOfEvents;