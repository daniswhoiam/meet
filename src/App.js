import React, { Component } from 'react';
import './App.css';
import './nprogress.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { extractLocations, getEvents, checkToken, getAccessToken } from './api';
import WelcomeScreen from './WelcomeScreen';

class App extends Component {
  state = {
    events: [],
    locations: [],
    eventNumber: 32,
    currentLocation: 'all',
    showWelcomeScreen: undefined
  }

  async componentDidMount() {
    this.mounted = true;
    const accessToken = localStorage.getItem('access_token');
    const isTokenValid = (await checkToken(accessToken)).error ? false : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    this.setState({ showWelcomeScreen: !(code || isTokenValid) });
    if ((code || isTokenValid) && this.mounted) {
      getEvents().then(events => {
        if (this.mounted) {
          const eventsCropped = events.slice(0, this.state.eventNumber);
          this.setState({ events: eventsCropped, locations: extractLocations(events) });
        }
      });
    }
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
        currentLocation: location,
        eventNumber: number
      });
    });
  }

  displayEventNumber = number => {
    this.setState({
      eventNumber: number
    });
  }

  render () {
    if (this.state.showWelcomeScreen === undefined) return <div className="App" />;

    return (
      <div className="App">
        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
        <EventList events={this.state.events} />
        <NumberOfEvents eventNumber={this.state.eventNumber} updateEvents={this.updateEvents} displayEventNumber={this.displayEventNumber} />
        <WelcomeScreen showWelcomeScreen={this.state.showWelcomeScreen} getAccessToken={() => { getAccessToken() }} />
      </div>
    );
  }
}

export default App;
