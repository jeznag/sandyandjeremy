// hosted on glitch.com
// https://glitch.com/edit/#!/decorous-door?path=server.js:29:0
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Webhooks are running");
});

app.get("/simple/webhook", (request, response) => {
  // Extract event code header
  const eventCode = request.get("X-RSVP_EVENT_CODE");

  const hasuraVariables = {
    "X-Hasura-Role": "user",
    // NB this is a bit of a hack - for our Hasura row permission
    // authorisation layer, we can only use user id or role to
    // restrict access to events matching the event code
    "X-Hasura-User-Id": eventCode
  };
  response.json(hasuraVariables);
});

// listen for requests :)
const listener = app.listen(port, function() {
  console.log("Your app is listening on port " + port);
});
