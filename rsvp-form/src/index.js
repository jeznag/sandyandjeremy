import React, { useState } from "react";
import ReactDOM from "react-dom";
import { RsvpForm } from "./RsvpForm";
import { ValidateEventCodeForm } from "./ValidateEventCodeForm";
import { createRSVP } from "./api/createRSVP";
import { Spin } from "antd";

import "antd/dist/antd.css";

const rootEl = document.getElementById("root");

async function handleSubmit(values, eventCode, setLoading, setSubmitted) {
  const mainGuest = values.guests[0];
  const additionalGuests = values.guests.slice(1);
  const roles = values.roles;

  setLoading(true);
  try {
    const createRsvpResult = await createRSVP(
      eventCode,
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
  eventCode,
  setEventcode,
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

  if (!eventCode) {
    return <ValidateEventCodeForm setEventCode={setEventcode} />;
  }

  return (
    <RsvpForm
      onSubmit={values =>
        handleSubmit(values, eventCode, setLoading, setSubmitted)
      }
    />
  );
}

function App() {
  const [eventCode, setEventCode] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  return (
    <div style={{ padding: 15 }}>
      <h2>RSVP</h2>
      {getComponentToDisplay(
        eventCode,
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
