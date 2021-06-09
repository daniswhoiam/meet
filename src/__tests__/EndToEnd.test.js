import puppeteer from 'puppeteer';

jest.setTimeout(30000);

describe('show/hide an events details', () => {

  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
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
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
  });

  afterAll(() => {
    browser.close();
  });

  test('Show events from all cities by default', async () => {
    await page.waitForSelector('.EventList');
    const locations = await page.$$('.event-location');
    const locationsWithoutDuplicates = [...locations];
    expect(locationsWithoutDuplicates).toBeDefined();
    expect(locationsWithoutDuplicates).not.toHaveLength(1);
  });

});