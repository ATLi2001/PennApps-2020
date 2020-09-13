// Client ID and API key from the Developer Console
var CLIENT_ID =
  "207523860993-qv5bri01sch1u6obs6b139mnirqmm6ru.apps.googleusercontent.com";
var API_KEY = "AIzaSyBIGJEGK-AG-6D2GrwB4CA8UmytFSDhSb4";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const spotify = [
  { val: "chill", URI: "spotify:playlist:37i9dQZF1DX4WYpdgoIcn6" },
  { val: "rnb", URI: "spotify:playlist:37i9dQZF1DWYmmr74INQlb" },
  { val: "mood", URI: "spotify:playlist:37i9dQZF1DX3rxVfibe1L0" },
  { val: "hiphop", URI: "spotify:playlist:37i9dQZF1DX0XUsuxWHRQd" },
  { val: "pop", URI: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M" },
  { val: "at_home", URI: "spotify:playlist:37i9dQZF1DWTLSN7iG21yC" },
  { val: "dinner", URI: "spotify:playlist:37i9dQZF1DX4xuWVBs4FgJ" },
  { val: "decades", URI: "spotify:playlist:37i9dQZF1DX4UtSsGT1Sbe" },
  { val: "jazz", URI: "spotify:playlist:37i9dQZF1DXbITWG1ZJKYt" },
  { val: "rock", URI: "spotify:playlist:37i9dQZF1DWXRqgorJj26U" },
  { val: "workout", URI: "spotify:playlist:37i9dQZF1DX76Wlfdnj7AP" },
  { val: "edm_dance", URI: "spotify:playlist:37i9dQZF1DX4dyzvuaRJ0n" },
  { val: "romance", URI: "spotify:playlist:37i9dQZF1DWXqpDKK4ed9O" },
  { val: "party", URI: "spotify:playlist:37i9dQZF1DXaXB8fQg7xif" },
  { val: "wellness", URI: "spotify:playlist:37i9dQZF1DX9uKNf5jGX6m" },
  { val: "sleep", URI: "spotify:playlist:37i9dQZF1DWZd79rJ6a7lp" },
  { val: "toplists", URI: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M" },
  { val: "gaming", URI: "spotify:playlist:37i9dQZF1DWTyiBJ6yEqeu" },
  { val: "focus", URI: "spotify:playlist:37i9dQZF1DX4sWSpwq3LiO" },
  { val: "metal", URI: "spotify:playlist:37i9dQZF1DWTcqUzwhNmKv" },
];

var signoutButton = document.getElementById("signout_button");

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        signoutButton.onclick = handleSignoutClick;
      },
      function (error) {
        appendPre(JSON.stringify(error, null, 2));
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    signoutButton.style.display = "block";
    listUpcomingEvents();
    listPlaylists();
  } else {
    signoutButton.style.display = "none";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  location.replace("index.html");
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendEvents(message, index) {
  // div is where content will go
  var div = document.getElementById("content");
  // inner div is card to contain event text
  var innerDiv = document.createElement("div");
  innerDiv.className = "event-card";
  // text of the event
  var text = document.createElement("h4");
  var textContent = document.createTextNode(message);
  text.appendChild(textContent);
  // have the even be identifiable
  text.setAttribute("id", `event${index}`);
  innerDiv.appendChild(text);
  div.appendChild(innerDiv);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 5,
      orderBy: "startTime",
    })
    .then(function (response) {
      var events = response.result.items;

      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          // keep only the date
          when = when.substring(0, 10);
          appendEvents(event.summary + "\n" + when, i);
        }
      } else {
        appendEvents("No upcoming events found.", -1);
      }
    });
}

async function listPlaylists() {
  if (document.getElementById("event0") !== null) {
    var playlistDiv = document.getElementById("playlists");
    for (i = 0; i < 5; i++) {
      var eventId = `event${i}`;
      // format current event for wolfram use
      var currEvent = document.getElementById(eventId).innerText;
      currEvent = currEvent.substring(0, currEvent.indexOf("2020"));
      currEvent = currEvent.trim();
      currEvent = currEvent.toLowerCase();
      console.log(currEvent);
      // call wolfram
      let genre = await wolframGenre(currEvent);
      console.log("Genre: " + genre);
      // find in spotify array
      var uri = spotify[0].URI;
      for (s = 0; s < spotify.length; s++) {
        if (spotify[s].val == genre) {
          uri = spotify[s].URI;
        }
      }
      // inner div is card to contain event text
      var innerDiv = document.createElement("div");
      innerDiv.className = "playlist-card";
      // iframe of the event
      var iframe = document.createElement("iframe");
      // var textContent = document.createTextNode(currEvent);
      var embed = uri.split(":")[2];
      iframe.setAttribute(
        "src",
        `https://open.spotify.com/embed/playlist/${embed}`
      );
      iframe.style.width = "300px";
      iframe.style.height = "80px";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowtransparency", "true");
      iframe.setAttribute("allow", "encrypted-media");
      innerDiv.appendChild(iframe);
      playlistDiv.appendChild(innerDiv);
    }
  } else {
    // check again for event0
    setTimeout(function () {
      listPlaylists();
    }, 100);
  }
}

async function wolframGenre(text) {
  let response = await fetch(
    `https://www.wolframcloud.com/obj/tmenezes/get-genre?keyword=${text}`
  );

  let json = await response.json();
  return json;
}
