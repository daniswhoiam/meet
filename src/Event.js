import React, { Component } from 'react';

class Event extends Component {
  state = {
    showDetails: false
  }

  handleShowDetails = () => {
    const newValue = !this.state.showDetails;
    this.setState({
      showDetails: newValue
    });
  }

  render() {
    const { event } = this.props;

    /* Data formatting */
    const eventStart = new Date(event.start.dateTime).toUTCString();
    const eventEnd = new Date(event.end.dateTime).toUTCString();

    return(
      <div className="event">
        {/* Basic event info */}
        <div className="event-name" value={event.summary}>{event.summary}</div>
        <div className="event-location" value={event.location}>{event.location}</div>
        <div className="event-time-wrapper">
          <div className="event-start" value={event.start.dateTime}>{eventStart}</div>
          <div className="event-end" value={event.end.dateTime}>{eventEnd}</div>
        </div>
        {/* Expandable event info */}
        {
          this.state.showDetails &&
          <div className="event-details">
            <div className="event-description">{event.description}</div>
            <a href={event.htmlLink}>View in calendar</a>
          </div>
        }
        {/* Expand buttom */}
        <button 
          className={this.state.showDetails ? "hide-details" : "show-details"}
          onClick={this.handleShowDetails}
          value={this.state.showDetails ? "Hide Details" : "Show Details"}
        ></button>
      </div>
    );
  }
}

export default Event;