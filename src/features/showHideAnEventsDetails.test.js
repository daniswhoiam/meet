import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react';
import { mount } from 'enzyme';
import EventList from '../EventList';
import Event from '../Event';
import { mockData } from '../mock-data';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
  test('An event element is collapsed by default', ({ given, when, then }) => {
    let EventListWrapper;
    let EventWrapper;
    given('the list of events has been loaded', () => {
      /* Loading the list of events */
      EventListWrapper = mount(<EventList events={mockData} />);
      EventWrapper = EventListWrapper.find(Event);
    });

    when('the user does not perform any action', () => {});

    then('the event element should be collapsed', () => {
      expect(EventWrapper.find('.event-details')).toHaveLength(0);
    });
  });

  test('User can expand an event to see its details', ({
    given,
    and,
    when,
    then
  }) => {
    let EventListWrapper;
    let EventWrapper;
    given('the list of events has been loaded', () => {
      /* Loading the list of events */
      EventListWrapper = mount(<EventList events={mockData} />);
    });

    and('a user has not expanded a certain event yet', () => {
      EventWrapper = EventListWrapper.find(Event).at(0); // Unexpanded event
    });

    when('user clicks on -Show Details- button for an event', () => {
      expect(EventWrapper.find('.event .show-details')).toBeDefined();

      EventWrapper.find('.event .show-details').props().onClick();
      EventListWrapper.update();
      EventWrapper = EventListWrapper.find(Event).at(0);
    });

    then('the event element will be expanded to show the event details', () => {
      expect(EventWrapper.find('.event-details')).toHaveLength(1);
    });
  });

  test('User can collapse an event to hide its details', ({
    given,
    and,
    when,
    then
  }) => {
    let EventListWrapper;
    let EventWrapper;
    given('the list of events has been loaded', () => {
      /* Loading the list of events */
      EventListWrapper = mount(<EventList events={mockData} />);
    });

    and('a user has already expanded a certain event', () => {
      EventWrapper = EventListWrapper.find(Event).at(0);

      expect(EventWrapper.find('.event .show-details')).toBeDefined();

      EventWrapper.find('.event .show-details').props().onClick();
      EventListWrapper.update();
      EventWrapper = EventListWrapper.find(Event).at(0);
    });

    when('user clicks on -Hide Details- button for that event', () => {
      expect(EventWrapper.find('.event .hide-details')).toBeDefined();

      EventWrapper.find('.event .hide-details').props().onClick();
      EventListWrapper.update();
      EventWrapper = EventListWrapper.find(Event).at(0);
    });

    then(
      'the event element will be collapsed to hide the event details',
      () => {
        expect(EventWrapper.find('.event-details')).toHaveLength(0);
      }
    );
  });
});
