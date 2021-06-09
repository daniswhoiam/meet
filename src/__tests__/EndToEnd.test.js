import puppeteer from 'puppeteer';

jest.setTimeout(30000);

describe('show/hide an events details', () => {

  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch(/* {
      headless: false,
      slowMo: 250, // slow down by 250ms
      ignoreDefaultArgs: ['--disable-extensions'] // ignores default setting that causes timeout errors
    } */);
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.event');
  });

  afterAll(() => {
    browser.close();
  });

  test('An event element is collapsed by default', async () => {
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeNull();
  });

  test('User can expand an event to see its details', async () => {
    await page.click('.event .show-details');
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeDefined();
  });

  test('User can collapse an event to hide its details', async () => {
    await page.click('.event .hide-details');
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeNull();
  });

});

describe('filter events by city', () => {

  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch(/* {
      headless: false,
      slowMo: 250, // slow down by 250ms
      ignoreDefaultArgs: ['--disable-extensions'] // ignores default setting that causes timeout errors
    } */);
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
  });

  afterAll(() => {
    browser.close();
  });

  test('Show events from all cities by default', async () => {
    await page.waitForSelector('.EventList');
    const locations = await page.$$eval('.event-location', l => {
      return l.map(el => el.getAttribute('data-value'));
    });
    const locationsWithoutDuplicates = [...new Set(locations)];

    expect(locationsWithoutDuplicates).toBeDefined();
    expect(locationsWithoutDuplicates).not.toHaveLength(1);
  });

  test('User should see suggestions when searching for a city', async () => {
    await page.waitForSelector('.CitySearch');
    await page.focus('.city');
    await page.keyboard.type('Berlin');
    await page.waitForSelector('.suggestions');
    const suggestions = await page.$$('.suggestions li');

    expect(suggestions).toBeDefined();
    expect(suggestions).not.toHaveLength(1);
  });

  test('User can select a city from the suggestions', async () => {
    await page.click('.suggestions li');
    await page.waitForFunction(() => !document.querySelector('.nprogress-busy')); // Wait until page has loaded
    const locations = await page.$$eval('.event-location', l => {
      return l.map(el => el.getAttribute('data-value'));
    });
    const locationsWithoutDuplicates = [...new Set(locations)];

    expect(locationsWithoutDuplicates).toBeDefined();
    expect(locationsWithoutDuplicates).toHaveLength(1);
  });

});