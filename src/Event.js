import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Event extends Component {
  state = {
    showDetails: false
  };

  handleShowDetails = () => {
    const newValue = !this.state.showDetails;
    this.setState({
      showDetails: newValue
    });
  };

  render() {
    const { event } = this.props;

    /* Data formatting */
    const eventStart = new Date(event.start.dateTime).toUTCString();
    const eventEnd = new Date(event.end.dateTime).toUTCString();

    return (
      <article className="event">
        {/* Basic event info */}
        <h2 className="event-name" data-value={event.summary}>
          {event.summary}
        </h2>
        <address className="event-location" data-value={event.location}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-geo-alt-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
          </svg>
          {event.location}
        </address>
        <div className="event-time-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-calendar-event"
            viewBox="0 0 16 16"
          >
            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
          </svg>
          <span className="pre-time">Starts:</span>
          <time className="event-start" data-value={event.start.dateTime}>
            {eventStart}
          </time>
          <span className="pre-time">Ends:</span>
          <time className="event-end" data-value={event.end.dateTime}>
            {eventEnd}
          </time>
        </div>
        {/* Expandable event info */}
        {this.state.showDetails && (
          <div className="event-details">
            <p className="event-description">{event.description}</p>
            <a href={event.htmlLink} rel="external noreferrer" target="_blank" className="event-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-box-arrow-up-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                />
                <path
                  fillRule="evenodd"
                  d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                />
              </svg>
              View in calendar
            </a>
          </div>
        )}
        {/* Expand buttom */}
        <button
          className={this.state.showDetails ? 'hide-details' : 'show-details'}
          onClick={this.handleShowDetails}
        >
          {this.state.showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </article>
    );
  }
}

Event.propTypes = {
  event: PropTypes.shape({
    start: PropTypes.shape({
      dateTime: PropTypes.string.isRequired
    }).isRequired,
    end: PropTypes.shape({
      dateTime: PropTypes.string.isRequired
    }).isRequired,
    summary: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    htmlLink: PropTypes.string.isRequired
  }).isRequired
};

export default Event;
