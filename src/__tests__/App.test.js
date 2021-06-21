import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';
import EventList from '../EventList';
import CitySearch from '../CitySearch';
import NumberOfEvents from '../NumberOfEvents';
import { mockData } from '../mock-data';
import { extractLocations, getEvents } from '../api';

describe('<App /> component', () => {
  let AppWrapper;
  beforeAll(() => {
    AppWrapper = shallow(<App />);
  });

  test('render list of events', () => {
    expect(AppWrapper.find(EventList)).toHaveLength(1);
  });

  test('render CitySearch', () => {
    expect(AppWrapper.find(CitySearch)).toHaveLength(1);
  });

  test('render NumberOfEvents', () => {
    expect(AppWrapper.find(NumberOfEvents)).toHaveLength(1);
  });
});

describe('<App /> integration', () => {
  test('App passes "events" state as a prop to EventList', () => {
    const AppWrapper = mount(<App />);
    const AppEventsState = AppWrapper.state('events');

    expect(AppEventsState).not.toEqual(undefined);
    expect(AppWrapper.find(EventList).props().events).toEqual(AppEventsState);
    AppWrapper.unmount();
  });

  test('App passes "locations" state as a prop to City Search', () => {
    const AppWrapper = mount(<App />);
    const AppLocationState = AppWrapper.state('locations');

    expect(AppLocationState).not.toEqual(undefined);
    expect(AppWrapper.find(CitySearch).props().locations).toEqual(
      AppLocationState
    );
    AppWrapper.unmount();
  });

  test('Get list of events matching the city selected by the user', async () => {
    const AppWrapper = await mount(<App />);
    const CitySearchWrapper = AppWrapper.find(CitySearch);
    const locations = extractLocations(mockData);

    CitySearchWrapper.setState({ suggestions: locations });
    const suggestions = CitySearchWrapper.state('suggestions');

    const selectedIndex = Math.floor(Math.random() * suggestions.length);
    const selectedCity = suggestions[selectedIndex];

    await CitySearchWrapper.instance().handleItemClicked(selectedCity);

    const allEvents = await getEvents();
    const eventsToShow = allEvents.filter(
      event => event.location === selectedCity
    );

    expect(AppWrapper.state('events')).toEqual(eventsToShow);
    expect(AppWrapper.state('currentLocation')).toEqual(selectedCity);
    AppWrapper.unmount();
  });

  test('Get list of all events when user selects "See all cities"', async () => {
    const AppWrapper = await mount(<App />);
    const suggestionItems = AppWrapper.find(CitySearch).find('.suggestions li');

    await suggestionItems.at(suggestionItems.length - 1).simulate('click');
    const allEvents = await getEvents();

    expect(AppWrapper.state('events')).toEqual(allEvents);
    AppWrapper.unmount();
  });

  test('Load max. default number of events by default', async () => {
    const AppWrapper = await mount(<App />);
    const AppEventsState = AppWrapper.state('events');
    const defaultNumber = AppWrapper.state('eventNumber');

    /* Include EventList in test */
    const EventListWrapper = AppWrapper.find(EventList);
    const eventsProp = EventListWrapper.props().events;

    expect(AppEventsState).toHaveLength(
      Math.min(AppEventsState.length, defaultNumber)
    );

    /* Additional tests for EventList */
    expect(eventsProp).toHaveLength(Math.min(eventsProp.length, defaultNumber));
    expect(EventListWrapper.find('li')).toHaveLength(
      Math.min(eventsProp.length, defaultNumber)
    );

    AppWrapper.unmount();
  });

  test('Load number of events specified in NumberOfEvents', async () => {
    const AppWrapper = await mount(<App />);
    const numberInput = AppWrapper.find(NumberOfEvents).find(
      '.event-number-input'
    );
    const eventObject = {
      target: {
        value: 2
      }
    };
    await numberInput.simulate('change', eventObject);

    AppWrapper.update();
    const AppEventsState = AppWrapper.state('events');
    /* Include EventList in test */
    const EventListWrapper = AppWrapper.find(EventList);
    const eventsProp = EventListWrapper.props().events;

    expect(AppEventsState).toHaveLength(eventObject.target.value);
    /* Additional tests for EventList */
    expect(eventsProp.length).toEqual(eventObject.target.value);
    expect(EventListWrapper.find('li')).toHaveLength(eventObject.target.value);

    AppWrapper.unmount();
  });

  test('Maintain location selection when changing number of events shown', async () => {
    const AppWrapper = await mount(<App />);
    AppWrapper.setState({
      currentLocation: 'Berlin'
    });
    const AppCurrentLocationState = AppWrapper.state('currentLocation');
    const numberInput = AppWrapper.find(NumberOfEvents).find(
      '.event-number-input'
    );
    const eventObject = {
      target: {
        value: 2
      }
    };

    await numberInput.simulate('change', eventObject);
    expect(AppCurrentLocationState).not.toEqual(undefined);

    expect(AppWrapper.state('currentLocation')).toEqual(
      AppCurrentLocationState
    );
    AppWrapper.unmount();
  });
});
