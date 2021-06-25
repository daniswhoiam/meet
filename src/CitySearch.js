import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InfoAlert } from './Alert';

class CitySearch extends Component {
  state = {
    query: '',
    suggestions: [],
    showSuggestions: undefined,
    infoText: ''
  };

  /**
   * Render suggestions based on user input.
   *
   * @param {Event} event Event that fires when something is entered into the input field.
   */
  handleInputChanged = event => {
    const value = event.target.value;
    const suggestions = this.props.locations.filter(location => {
      return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
    });

    if (suggestions.length === 0) {
      this.setState({
        query: value,
        infoText:
          'We can not find the city you are looking for. Please try another city.'
      });
    } else {
      this.setState({
        query: value,
        suggestions,
        infoText: ''
      });
    }
  };

  /**
   * Hide suggestions and re-render events list based on new filter criteria.
   *
   * @param {string} suggestion Suggestion that is chosen by the user.
   */
  handleItemClicked = suggestion => {
    this.setState({
      query: suggestion,
      suggestions: [],
      showSuggestions: false,
      infoText: ''
    });

    this.props.updateEvents(suggestion, null);
  };

  render() {
    return (
      <div className="CitySearch">
        <InfoAlert text={this.state.infoText} />
        <input
          type="text"
          className="city"
          value={this.state.query}
          onChange={this.handleInputChanged}
          onFocus={() => this.setState({ showSuggestions: true })}
          onBlur={e => {
            if (
              e.relatedTarget === null ||
              (e.relatedTarget && !(e.relatedTarget.className === 'suggestion'))
            ) {
              this.setState({ showSuggestions: false });
            }
          }}
        />
        <div className="suggestions-wrapper">
          <ul
            className="suggestions"
            style={this.state.showSuggestions ? {} : { display: 'none' }}
          >
            {this.state.suggestions.map(suggestion => (
              <li
                key={suggestion}
                className="suggestion"
                onClick={() => this.handleItemClicked(suggestion)}
                tabIndex="0"
              >
                {suggestion}
              </li>
            ))}
            <li
              className="suggestion"
              tabIndex="0"
              key="all"
              onClick={() => this.handleItemClicked('all')}
            >
              <b>See all cities</b>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

CitySearch.propTypes = {
  locations: PropTypes.array.isRequired,
  updateEvents: PropTypes.func.isRequired
};

export default CitySearch;
