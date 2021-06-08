import React, { Component } from 'react';
import './App.css';
import './nprogress.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { extractLocations, getEvents } from './api';

class App extends Component {
  state = {
    events: [],
    locations: [],
    eventNumber: 32,
    currentLocation: 'all'
  }

  componentDidMount() {
    this.mounted = true;
    getEvents().then(events => {
      if (this.mounted) {
        const eventsCropped = events.slice(0, this.state.eventNumber);
        this.setState({ events: eventsCropped, locations: extractLocations(events) });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateEvents = (location, number) => {
    /* Default values */
    location = location || this.state.currentLocation;
    number = number || this.state.eventNumber;

    getEvents().then(events => {
      const locationEvents = (location === 'all') ?
        events : 
        events.filter(event => event.location === location);
      const numberLocationEvents = locationEvents.slice(0, number);
      this.setState({
        events: numberLocationEvents,
        currentLocation: location
      });
    });
  }

  render () {
    return (
      <div className="App">
        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
        <EventList events={this.state.events} />
        <NumberOfEvents eventNumber={this.state.eventNumber} updateEvents={this.updateEvents} />
      </div>
    );
  }
}

export default App;
