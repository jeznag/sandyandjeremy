import React, { useState } from "react";

import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

// TODO - use Query component instead of raw query
// This is a bit gross but doing it this way
// due to constraints of Hasura permissions layer

async function handleCheckEventCode(
  eventCode,
  setErrorMessage,
  setEventCode,
  setIsLoading
) {
  const getMatchingEventQuery = gql`
    {
      events(where: {event_code: {_eq: "${eventCode}"}}) {
        event_id
        event_name
        event_code
      }
    }
  `;

  const client = new ApolloClient({
    uri: "https://sandy-jem-wedding-site.herokuapp.com/v1alpha1/graphql",
    headers: {
      "X-RSVP_EVENT_CODE": eventCode
    }
  });

  setIsLoading(true);
  try {
    const matchingEventData = await client.query({
      query: getMatchingEventQuery
    });
    if (matchingEventData.data.events.length) {
      setEventCode(matchingEventData.data.events[0].event_code);
    } else {
      setErrorMessage("Invalid event code");
    }
  } catch (e) {
    setErrorMessage("Invalid event code");
  }

  setIsLoading(false);
}

export function EventCodeForm({ setEventCode }) {
  const [eventCode, changeEventCode] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div style={{ padding: 15 }}>
      <h3>Enter your RSVP code</h3>
      {errorMessage && <span class="error">{errorMessage}</span>}
      {isLoading && <div class="loading">Loading...</div>}
      <input
        type="text"
        onChange={e => {
          changeEventCode(e.target.value);
        }}
        value={eventCode}
      />
      <button
        onClick={() =>
          handleCheckEventCode(
            eventCode,
            setErrorMessage,
            setEventCode,
            setIsLoading
          )
        }
      >
        Check
      </button>
    </div>
  );
}
