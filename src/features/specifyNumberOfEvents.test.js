import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { mount } from 'enzyme';
import EventList from '../EventList';
import Event from '../Event';
import App from '../App';
import NumberOfEvents from '../NumberOfEvents';
import { mockData } from '../mock-data';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, test => {

  test('When user hasn\'t specified a number. 32 is the default number', ({ given, when, then }) => {
    let EventListWrapper;
    let EventWrapper;
    given('the list of events has been loaded', () => {
      EventListWrapper = mount(<EventList events={mockData} />);
      EventWrapper = EventListWrapper.find(Event);
    });

    when('a user does not enter or select a specific number of events to be shown', () => {

    });

    then('32 will be the number of events displayed', () => {
      expect(EventWrapper).toHaveLength(Math.min(mockData.length,32));
    });
  });

  test('User can change the number of events they want to see', ({ given, when, then }) => {
    let AppWrapper;
    let NumberOfEventsWrapper;
    let EventListWrapper;
    given('the list of events has been loaded', () => {
      /* Here, the whole App is necessary */
      AppWrapper = mount(<App />);
    });

    when('a user enters or selects the number of events to be shown', () => {
      NumberOfEventsWrapper = AppWrapper.find(NumberOfEvents);
      NumberOfEventsWrapper.find('input').simulate('change', { target: { value: 2 } });
    });

    then('the list of events will be re-rendered, as a result displaying the number of events that the user has specified', () => {     
      AppWrapper.update();
      EventListWrapper = AppWrapper.find(EventList);
      expect(EventListWrapper.find(Event)).toHaveLength(2);
    });
  });

});