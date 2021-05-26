const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar("v3");

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * Credentials are values required to get access to the calendar. "process.env" means the value is in the
 * "config.json" file. This is a best practice as it keeps the API secrets hidden. (config.json should be in .gitignore)
 */
const credentials = {
  client_id: process.env.CLIENT_ID,
  project_id: process.env.PROJECT_ID,
  client_secret: process.env.CLIENT_SECRET,
  calendar_id: process.env.CALENDAR_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cent_url: "https://www.googleapis.com/oauth2/v1/certs",
  redirect_uris: ["https://daniswhoiam.github.io/meet"],
  javascript_origins: ["https://daniswhoiam.github.io", "http://localhost:3000"]
};

const { client_secret, client_id, redirect_uris, calendar_id } = credentials;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

/**
 * 
 * The first step in the OAuth process is to generate a URL so users can log in with
 * Google and be authorized to see the calendar. After logging in, they'll receive a code as a URL parameter.
 * 
 * @returns Object
 */

module.exports.getAuthURL = async () => {
  /* 
   * Scopes arrays passed to the "scope" option. Any scopes passed must be enabled in the
   * "OAuth consent screen" settings in the project on the Google Console.
  */
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      authUrl: authUrl
    })
  };
};

module.exports.getAccessToken = async (event) => {
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const code = decodeURIComponent(`${event.pathParameters.code}`);

  return new Promise((resolve, reject) => {
    /* Exchange authorization code for access token */
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return reject(err);
      }
      return resolve(token);
    });
  })
    .then((token) => {
      // Respond with oAuth token
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"  
        },
        body: JSON.stringify(token)
      };
    })
    .catch((err) => {
      // Handle error
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify(err)
      };
    });
};

module.exports.getCalendarEvents = async (event) => {
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const access_token = decodeURIComponent(`${event.pathParameters.access_token}`);
  oAuth2Client.setCredentials({access_token});

  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: calendar_id,
        auth: oAuth2Client,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime"
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  })
    .then(response => {
      // Return event list
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"  
        },
        body: JSON.stringify({ events: response.data.items })
      };
    })
    .catch(err => {
      // Handle error
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify(err)
      };
    });
  };