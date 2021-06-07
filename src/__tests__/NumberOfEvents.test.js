import React from 'react';
import { shallow } from 'enzyme';
import NumberOfEvents from '../NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  let NumberOfEventsWrapper;
  beforeAll(() => {
    NumberOfEventsWrapper = shallow(<NumberOfEvents updateEvents={() => {}} eventNumber={32} />);
  });

  test('There is a field to change the number of events shown', () => {
    expect(NumberOfEventsWrapper.find('.event-number-input')).toHaveLength(1);
  });

  test('The input field displays the right value', () => {
    const numberSetting = NumberOfEventsWrapper.state('numberSetting');
    expect(NumberOfEventsWrapper.find('.event-number-input').prop('value')).toBe(numberSetting);
  });

  test('Change state when number input changes', () => {
    const eventObject = {
      target: {
        value: 10
      }
    };
    NumberOfEventsWrapper.find('.event-number-input').simulate('change', eventObject);
    expect(NumberOfEventsWrapper.state('numberSetting')).toBe(eventObject.target.value);
  });
  
});