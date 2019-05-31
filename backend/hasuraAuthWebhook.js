module.exports = (request, response) => {
  // Extract event code header
  const eventCode = request.headers["x-rsvp_event_code"];

  const hasuraVariables = {
    "X-Hasura-Role": "user",
    // NB this is a bit of a hack - for our Hasura row permission
    // authorisation layer, we can only use user id or role to
    // restrict access to events matching the event code
    "X-Hasura-User-Id": eventCode
  };

  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(hasuraVariables, null, 4));
};
