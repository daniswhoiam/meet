import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Event from './Event';
import { WarningAlert } from './Alert';

class EventList extends Component {
  warningMessage = 'You are offline. The displayed information might not be up-to-date';

  state = {
    warningText: navigator.onLine ? this.warningMessage : ''
  }

  toggleOfflineMessage = () => {
    navigator.onLine ? 
      this.setState({ warningText: this.warningMessage }) :
      this.setState({ warningText: '' });
  }

  render() {
    const { events } = this.props;

    window.addEventListener('offline', this.toggleOfflineMessage);
    window.addEventListener('online', this.toggleOfflineMessage);

    return(
      <>
        <WarningAlert warningText={this.state.warningText} />
        <ul className="EventList">
          {events.map(event => 
            <li key={event.id}>
              <Event event={event} />
            </li>  
          )}
        </ul>
      </>
    );
  }
}

EventList.propTypes = {
  events: PropTypes.array.isRequired
}

export default EventList;