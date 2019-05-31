import React, { useState } from "react";

import { Alert, Button, Form, Input, Spin } from "antd";
import { getMatchingEvent } from "./api/getMatchingEvent";

async function handleSubmitEventCode(
  e,
  validateFields,
  setErrorMessage,
  setEventData,
  setIsLoading
) {
  e.preventDefault(true);
  validateFields(async (err, values) => {
    if (!err) {
      checkEventCode(
        values.eventCode,
        setErrorMessage,
        setEventData,
        setIsLoading
      );
    }
  });
}

async function checkEventCode(
  eventCode,
  setErrorMessage,
  setEventData,
  setIsLoading
) {
  setIsLoading(true);
  try {
    const matchingEventData = await getMatchingEvent(eventCode);

    setIsLoading(false);
    if (matchingEventData.data.events.length) {
      setEventData(matchingEventData.data.events[0]);
    } else {
      setErrorMessage("Invalid event code");
    }
  } catch (e) {
    setIsLoading(false);
    setErrorMessage("Invalid event code");
  }
}

function UnwrappedValidateEventCodeForm(props) {
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { getFieldDecorator } = props.form;
  const { setEventData } = props;

  const queryParams = new URLSearchParams(window.location.search);
  const rsvpEventCodeFromURL = queryParams.get("rsvp-event-code");

  if (rsvpEventCodeFromURL && isFirstRender) {
    setIsFirstRender(false);
    checkEventCode(rsvpEventCodeFromURL, setErrorMessage, setEventData, setIsLoading);
  }

  return (
    <Form
      onSubmit={e =>
        handleSubmitEventCode(
          e,
          props.form.validateFields,
          setErrorMessage,
          setEventData,
          setIsLoading
        )
      }
    >
      <h3>Enter your RSVP code</h3>
      {errorMessage && (
        <Alert
          message="Invalid RSVP code"
          description="Please double check the RSVP code you entered. If you have issues, contact Sandy/Jeremy"
          type="error"
        />
      )}
      {isLoading && <Spin tip="Loading..." />}
      <Form.Item>
        {getFieldDecorator("eventCode", {
          initialValue: rsvpEventCodeFromURL,
          rules: [
            {
              required: true,
              message: "Please enter the event code you got from us"
            }
          ]
        })(<Input disabled={isLoading} placeholder="Event Code" />)}
      </Form.Item>
      <Button disabled={isLoading} type="primary" htmlType="submit">
        Check Code
      </Button>
    </Form>
  );
}

export const ValidateEventCodeForm = Form.create({ name: "event_code_form" })(
  UnwrappedValidateEventCodeForm
);
