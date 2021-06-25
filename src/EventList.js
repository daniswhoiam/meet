import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Event from './Event';
import { WarningAlert } from './Alert';

class EventList extends Component {
  warningMessage =
    'You are offline. The displayed information might not be up-to-date';

  state = {
    warningText: navigator.onLine ? '' : this.warningMessage
  };

  /**
   * Show warning message if there is no internet connection
   */
  toggleOfflineMessage = () => {
    navigator.onLine
      ? this.setState({ warningText: '' })
      : this.setState({ warningText: this.warningMessage });
  };

  render() {
    const { events } = this.props;

    /* If connection gets lost after user has been online first */
    window.addEventListener('offline', this.toggleOfflineMessage);
    window.addEventListener('online', this.toggleOfflineMessage);

    return (
      <div>
        <WarningAlert text={this.state.warningText} />
        <ul className="EventList">
          {events.map(event => (
            <li key={event.id}>
              <Event event={event} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

EventList.propTypes = {
  events: PropTypes.array.isRequired
};

export default EventList;
