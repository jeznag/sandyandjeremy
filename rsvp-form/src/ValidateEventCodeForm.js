import React, { useState } from "react";

import { Alert, Button, Form, Input, Spin } from "antd";
import { getMatchingEvent } from "./api/getMatchingEvent";

async function handleCheckEventCode(
  e,
  validateFields,
  setErrorMessage,
  setEventCode,
  setIsLoading
) {
  e.preventDefault(true);
  validateFields(async (err, values) => {
    if (!err) {
      setIsLoading(true);
      try {
        const matchingEventData = await getMatchingEvent(values.eventCode);

        setIsLoading(false);
        if (matchingEventData.data.events.length) {
          setEventCode(matchingEventData.data.events[0].event_code);
        } else {
          setErrorMessage("Invalid event code");
        }
      } catch (e) {
        setIsLoading(false);
        setErrorMessage("Invalid event code");
      }
    }
  });
}

function UnwrappedValidateEventCodeForm(props) {
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { getFieldDecorator } = props.form;
  const { setEventCode } = props;

  return (
    <Form
      onSubmit={e =>
        handleCheckEventCode(
          e,
          props.form.validateFields,
          setErrorMessage,
          setEventCode,
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
