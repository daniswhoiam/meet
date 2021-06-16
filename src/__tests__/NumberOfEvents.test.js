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
    console.log(NumberOfEventsWrapper.debug());
    const numberSetting = NumberOfEventsWrapper.instance().props.eventNumber;
    expect(NumberOfEventsWrapper.find('.event-number-input').prop('value')).toBe(numberSetting);
  });
  
});