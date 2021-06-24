import React from 'react';
import { shallow } from 'enzyme';
import Event from '../Event';
import { mockData } from '../mock-data';

describe('<Event /> component', () => {
  let EventWrapper, mockEvent;

  beforeAll(() => {
    if (mockData && Array.isArray(mockData)) {
      mockEvent = mockData[0];
    }
    EventWrapper = shallow(<Event event={mockEvent} />);
  });

  test('event is collapsed by default', () => {
    expect(EventWrapper.state('showDetails')).toBe(false);
  });

  test('basic event info is visible by default', () => {
    const expectedInfo = {
      eventName: mockEvent.summary,
      eventLocation: mockEvent.location,
      eventStart: mockEvent.start.dateTime,
      eventEnd: mockEvent.end.dateTime
    };
    const actualInfo = {
      eventName: EventWrapper.find('.event-name').prop('data-value'),
      eventLocation: EventWrapper.find('.event-location').prop('data-value'),
      eventStart: EventWrapper.find('.event-start').prop('data-value'),
      eventEnd: EventWrapper.find('.event-end').prop('data-value')
    };
    expect(actualInfo).toMatchObject(expectedInfo);
  });

  test('event should expand after user clicks on button', () => {
    /* user has not clicked yet */
    EventWrapper.setState({
      showDetails: false
    });
    /* user clicks on button */
    EventWrapper.find('.show-details').simulate('click');
    /* the event should expand */
    expect(EventWrapper.state('showDetails')).toBe(true);
  });

  test('when event is expanded details should be rendered', () => {
    /* event is expanded */
    EventWrapper.setState({
      showDetails: true
    });
    /* details should be rendered */
    expect(EventWrapper.find('.event-details')).toHaveLength(1);
  });

  test('event should collapse when it is expanded and user clicks on button', () => {
    /* event is expanded */
    EventWrapper.setState({
      showDetails: true
    });
    /* user clicks on hide button */
    EventWrapper.find('.hide-details').simulate('click');
    /* the event should collapse */
    expect(EventWrapper.state('showDetails')).toBe(false);
  });

  test('event details should be hidden after click on hide button', () => {
    /* Initially event is extended */
    EventWrapper.setState({
      showDetails: true
    });
    /* User clicks on hide button */
    EventWrapper.find('.hide-details').simulate('click');
    /* Details should not be there anymore */
    expect(EventWrapper.find('.event-details')).toEqual({});
  });
});
