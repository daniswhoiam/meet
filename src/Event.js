import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
      <article className="event">
        {/* Basic event info */}
        <h2 className="event-name" data-value={event.summary}>{event.summary}</h2>
        <address className="event-location" data-value={event.location}>{event.location}</address>
        <div className="event-time-wrapper">
          <time className="event-start" data-value={event.start.dateTime}>{eventStart}</time>
          <time className="event-end" data-value={event.end.dateTime}>{eventEnd}</time>
        </div>
        {/* Expandable event info */}
        {
          this.state.showDetails &&
          <div className="event-details">
            <p className="event-description">{event.description}</p>
            <a href={event.htmlLink} rel="external">View in calendar</a>
          </div>
        }
        {/* Expand buttom */}
        <button 
          className={this.state.showDetails ? "hide-details" : "show-details"}
          onClick={this.handleShowDetails}
        >{this.state.showDetails ? "Hide Details" : "Show Details"}</button>
      </article>
    );
  }
}

Event.propTypes = {
  event: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    htmlLink: PropTypes.string.isRequired
  })
}

export default Event;