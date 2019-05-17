import React, { useState } from "react";
import ReactDOM from "react-dom";
import { RsvpForm } from "./RsvpForm";
import { ValidateEventCodeForm } from "./ValidateEventCodeForm";
import { createRSVP } from "./api/createRSVP";
import { Spin } from "antd";

import "antd/dist/antd.css";

const rootEl = document.getElementById("root");

async function handleSubmit(values, eventData, setLoading, setSubmitted) {
  const mainGuest = values.guests[0];
  const additionalGuests = values.guests.slice(1);
  const roles = values.roles;

  setLoading(true);
  try {
    const createRsvpResult = await createRSVP(
      eventData,
      mainGuest,
      additionalGuests,
      roles
    );
    setLoading(false);
    setSubmitted(true);
  } catch (e) {
    debugger;
    setLoading(false);
  }
}

function getComponentToDisplay(
  eventData,
  setEventData,
  isLoading,
  setLoading,
  isSubmitted,
  setSubmitted
) {
  if (isSubmitted) {
    return <span>Thanks! See you at the ceremony.</span>;
  }

  if (isLoading) {
    return <Spin tip="Loading..." />;
  }

  if (!eventData) {
    return <ValidateEventCodeForm setEventData={setEventData} />;
  }

  return (
    <RsvpForm
      onSubmit={values =>
        handleSubmit(values, eventData, setLoading, setSubmitted)
      }
      eventData={eventData}
    />
  );
}

function App() {
  const [eventData, setEventCode] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  return (
    <div style={{ padding: 15 }}>
      <h2>RSVP</h2>
      {getComponentToDisplay(
        eventData,
        setEventCode,
        isLoading,
        setLoading,
        isSubmitted,
        setSubmitted
      )}
    </div>
  );
}

ReactDOM.render(<App />, rootEl);
