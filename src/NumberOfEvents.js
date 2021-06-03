import React, { Component } from 'react';

class NumberOfEvents extends Component {
  state = {
    numberSetting: 32
  };

  handleNumberSetting = event => {
    const newValue = event.target.value;
    this.setState({
      numberSetting: newValue
    });
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