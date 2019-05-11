import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import RsvpForm from "./RsvpForm";
import { EventCodeForm } from "./EventCodeForm";

const rootEl = document.getElementById("root");

function handleSubmit() {
  debugger;
}

function getComponentToDisplay(eventCode, setEventcode) {
  if (!eventCode) {
    return <EventCodeForm setEventCode={setEventcode} />;
  }

  return <RsvpForm onSubmit={handleSubmit} />;
}

function App() {
  const [eventCode, setEventCode] = useState();
  return (
    <Provider store={store}>
      <div style={{ padding: 15 }}>
        <h2>RSVP</h2>
        {getComponentToDisplay(eventCode, setEventCode)}
      </div>
    </Provider>
  );
}

ReactDOM.render(<App />, rootEl);
