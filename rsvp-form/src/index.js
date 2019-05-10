import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import RsvpForm from "./RsvpForm";

const rootEl = document.getElementById("root");

function handleSubmit() {
  debugger;
}

function App() {
  return (
    <Provider store={store}>
      <div style={{ padding: 15 }}>
        <h2>RSVP</h2>
        <RsvpForm onSubmit={handleSubmit} />
      </div>
    </Provider>
  );
}

ReactDOM.render(<App />, rootEl);
