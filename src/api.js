import axios from 'axios';
import NProgress from 'nprogress';
import { mockData } from './mock-data';

/**
 * Extracts locations out of the events returned by the API.
 *
 * @param {Array} events The events fetched from the API.
 * @returns {Array} locations The locations of all the events.
 */
export const extractLocations = events => {
  let extractLocations = events.map(event => event.location);
  let locations = [...new Set(extractLocations)];
  return locations;
};

/**
 * Checks whether the current access token is valid.
 *
 * @param {string} accessToken Access Token to get access to the API data.
 * @returns {JSON} result Informing about the validity of the current access token.
 */
export const checkToken = async accessToken => {
  const result = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  )
    .then(res => res.json())
    .catch(err => err.json());

  return result;
};

/**
 * Clean query data from URL
 */
const removeQuery = () => {
  let newurl = window.location.protocol + '//' + window.location.host;
  if (window.history.pushState && window.location.pathname) {
    newurl += window.location.pathname;
  }
  window.history.pushState('', '', newurl);
};

/**
 * Get access token for API via serverless function.
 *
 * @param {string} code Code to get access token via serverless function.
 * @returns {string} access_token Access token to get access to the API data.
 */
const getToken = async code => {
  const encodeCode = encodeURIComponent(code);
  const { access_token } = await fetch(
    'https://y87fhuhw1b.execute-api.eu-central-1.amazonaws.com/dev/api/token/' +
      encodeCode
  )
    .then(res => res.json())
    .catch(err => err);

  access_token && localStorage.setItem('access_token', access_token);

  return access_token;
};

/**
 * Get events from the calendar API (online) or cache (offline) (or mockdata in development).
 *
 * @returns {Array} result.data.events Events from the calendar API.
 */
export const getEvents = async () => {
  NProgress.start();

  /* mockData as data source during development */
  if (window.location.href.startsWith('http://localhost')) {
    NProgress.done();
    return mockData;
  }

  /* Access data from cache if user is offline */
  if (!navigator.onLine) {
    const data = localStorage.getItem('lastEvents');
    NProgress.done();
    return data ? JSON.parse(data).events : [];
  }

  /* Get valid access token to user for API call */
  const token = await getAccessToken();

  if (token) {
    removeQuery();
    const url =
      'https://y87fhuhw1b.execute-api.eu-central-1.amazonaws.com/dev/api/get-events/' +
      token;
    const result = await axios.get(url);

    if (result.data) {
      const locations = extractLocations(result.data.events);
      localStorage.setItem('lastEvents', JSON.stringify(result.data));
      localStorage.setItem('locations', JSON.stringify(locations));
    }

    NProgress.done();
    return result.data.events;
  }
};

/**
 * Get either saved and valid access token or a new one getToken.
 *
 * @returns {string|null} accessToken Access token to get access to the API data or redirect to authUrl.
 */
export const getAccessToken = async () => {
  /* Get saved token and check whether it is still valid (or existent) */
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  /* If token is not valid or existent, get new one */
  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem('access_token');
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get('code');

    if (!code) {
      const results = await axios.get(
        'https://y87fhuhw1b.execute-api.eu-central-1.amazonaws.com/dev/api/get-auth-url'
      );
      const { authUrl } = results.data;
      return (window.location.href = authUrl);
    }

    return code && getToken(code);
  }

  return accessToken;
};
