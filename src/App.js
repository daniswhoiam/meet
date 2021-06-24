import React, { Component } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './App.scss';
import './nprogress.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import WelcomeScreen from './WelcomeScreen';
import EventGenre from './EventGenre';
import { extractLocations, getEvents, checkToken, getAccessToken } from './api';

class App extends Component {
  state = {
    events: [],
    locations: [],
    eventNumber: 32,
    currentLocation: 'all',
    showWelcomeScreen: undefined
  };

  async componentDidMount() {
    this.mounted = true;
    const accessToken = localStorage.getItem('access_token');
    const isTokenValid = (await checkToken(accessToken)).error ? false : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    this.setState({
      showWelcomeScreen: !(
        code ||
        isTokenValid ||
        window.location.hostname === 'localhost'
      )
    });
    if (
      (code || isTokenValid || window.location.hostname === 'localhost') &&
      this.mounted
    ) {
      getEvents().then(events => {
        if (this.mounted) {
          const eventsCropped = events.slice(0, this.state.eventNumber);
          this.setState({
            events: eventsCropped,
            locations: extractLocations(events)
          });
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
      const locationEvents =
        location === 'all'
          ? events
          : events.filter(event => event.location === location);
      const numberLocationEvents = locationEvents.slice(0, number);
      this.setState({
        events: numberLocationEvents,
        currentLocation: location,
        eventNumber: number
      });
    });
  };

  /**
   * Getting data for the scatter plot
   *
   * @returns Object { city, number }
   */
  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map(location => {
      const number = events.filter(event => event.location === location).length;
      const city = location.split(', ').shift();
      return { city, number };
    });
    return data;
  };

  displayEventNumber = number => {
    this.setState({
      eventNumber: number
    });
  };

  render() {
    /* if (this.state.showWelcomeScreen === undefined)
      return <div className="App" />; */

    return (
      <div className="App">
        <div className="brand" title="<meet />">
          {'<meet />'}
        </div>
        <CitySearch
          locations={this.state.locations}
          updateEvents={this.updateEvents}
        />
        <div className="data-vis-wrapper">
          <h4>Events by category</h4>
          <EventGenre events={this.state.events} />
          <h4>Events in each city</h4>
          <ResponsiveContainer height={400}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
              }}
              className="scatterChart"
            >
              <CartesianGrid stroke="#769769" />
              <XAxis type="category" dataKey="city" name="city" />
              <YAxis
                type="number"
                dataKey="number"
                name="number of events"
                allowDecimals={false}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={this.getData()} fill="#103103" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <EventList events={this.state.events} />
        <NumberOfEvents
          eventNumber={this.state.eventNumber}
          updateEvents={this.updateEvents}
          displayEventNumber={this.displayEventNumber}
        />
        <WelcomeScreen
          showWelcomeScreen={this.state.showWelcomeScreen}
          getAccessToken={() => {
            getAccessToken();
          }}
        />
        <div className="footer">
          <p className="footer-text">
            Made with
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fillRule="currentColor"
              className="bi bi-suit-heart-fill"
              viewBox="0 0 16 16"
              width="18"
              height="18"
              preserveAspectRatio="xMinYMid"
            >
              <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
            </svg>
            by @daniswhoiam
          </p>
          <div className="social-icons">
            {/* GitHub Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <a
                href="https://github.com/daniswhoiam/"
                aria-label="GitHub link"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </a>
            </svg>
            {/* LinkedIn Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fillRule="currentColor"
              className="bi bi-linkedin"
              viewBox="0 0 16 16"
            >
              <a
                href="https://www.linkedin.com/in/daniil-belazovschi/"
                aria-label="LinkedIn link"
              >
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
              </a>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
