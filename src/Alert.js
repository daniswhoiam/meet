import React, { Component } from 'react';

/**
 * Basic Alert Template
 */
class Alert extends Component {
  constructor(props) {
    super(props);
    this.color = null;
  }

  /**
   * Access to color setting
   * 
   * @returns Object {}
   */
  getStyle = () => {
    return {
      color: this.color
    };
  };

  render() {
    return (
      <div className="Alert">
        <p style={this.getStyle()}>{this.props.text}</p>
      </div>
    );
  }
}

/**
 * Low importance alert to inform user
 */
class InfoAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = 'blue';
  }
}

/**
 * High importance alert to point out an error
 */
class ErrorAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = 'red';
  }
}

/**
 * Medium importance alert to warn user about something important
 */
class WarningAlert extends Alert {
  constructor(props) {
    super(props);
    this.color = 'orange';
  }
}

export { InfoAlert, ErrorAlert, WarningAlert };
