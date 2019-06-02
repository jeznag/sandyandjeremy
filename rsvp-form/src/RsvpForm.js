import React, { Fragment, useState } from "react";
import { Button, Divider, Form, Input, Select } from "antd";

import { getRoleParts, ROLE_NAME_IDX } from "./utils/getRoleParts";

import { FieldArray } from "./components/FieldArray";

const validateAndSubmit = (e, validateFields, submitHandler) => {
  e.preventDefault();
  validateFields((err, values) => {
    if (!err) {
      submitHandler(values);
    }
  });
};

const renderRolesSubform = (form, eventData) => {
  if (eventData.help_needed.length === 0) {
    return null;
  }
  return (
    <Fragment>
      <Divider orientation="left" className="first">
        We'd love your help to make the ceremony awesome. How can you help?
      </Divider>
      <FieldArray
        {...form}
        name="roles"
        panelName={dataForThisRow => {
          return `${
            dataForThisRow.roleName
              ? getRoleParts(dataForThisRow.roleName)[ROLE_NAME_IDX]
              : ""
          }`;
        }}
        fields={[
          {
            name: "roleName",
            field: () => (
              <Select placeholder="Role">
                {eventData.help_needed.map(availableRole => (
                  <Select.Option
                    key={availableRole.role_type}
                    value={`${availableRole.role_type}|${
                      availableRole.help_needed_id
                    }`}
                  >
                    {availableRole.role_type}
                  </Select.Option>
                ))}
              </Select>
            )
          },
          {
            name: "details",
            field: () => <Input.TextArea rows={4} placeholder={"Details"} />
          }
        ]}
      />
    </Fragment>
  );
};

const eventDetails = eventData => {
  return (
    <div>
      <p>We can't wait to see you at the {eventData.event_name}!</p>
      <p>Here are the details:</p>
      <p>
        <b>What's happening</b>: {eventData.event_description}
      </p>
      <p>
        <b>Venue</b>: {eventData.event_venue}
      </p>
      <p>
        <b>Date</b>: {eventData.event_date}
      </p>
      <p>
        <b>Time</b>: {eventData.event_time}
      </p>
      <p>
        <b>Dress Code</b>: {eventData.dress_code}
      </p>
      <p>
        <b>Gifts</b>: {eventData.gift_policy}
      </p>
    </div>
  );
};

const UnwrappedRSVPForm = props => {
  const { form, eventData } = props;

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [initialValueForGuests, setInitialValueForGuests] = useState(null);

  if (isFirstRender) {
    setIsFirstRender(false);

    const queryParams = new URLSearchParams(window.location.search);
    const rsvpDataFromURL = queryParams.get("rsvp-details");
    setInitialValueForGuests(JSON.parse(atob(rsvpDataFromURL)));
  }

  return (
    <Form
      onSubmit={e =>
        validateAndSubmit(e, props.form.validateFields, props.onSubmit)
      }
    >
      {eventDetails(eventData)}
      {/* TODO show event details */}
      <Divider orientation="left" className="first">
        Who's coming along?
      </Divider>
      <FieldArray
        {...form}
        initialValue={initialValueForGuests}
        name="guests"
        panelName={dataForThisRow => {
          return `${dataForThisRow.firstName || ""} ${dataForThisRow.lastName ||
            ""}`;
        }}
        fields={[
          {
            name: "firstName",
            field: () => <Input placeholder={"First Name"} />
          },
          {
            name: "lastName",
            field: () => <Input placeholder={"Last Name"} />
          },
          {
            name: "email",
            field: () => <Input placeholder={"Email"} />
          },
          {
            name: "phone",
            field: () => <Input placeholder={"Phone"} />
          },
          {
            name: "dietaryRequirements",
            field: () => (
              <Input.TextArea rows={4} placeholder={"Dietary Requirements"} />
            )
          }
        ]}
      />
      {renderRolesSubform(form, eventData)}
      <Button type="primary" htmlType="submit">
        RSVP
      </Button>
    </Form>
  );
};

export const RsvpForm = Form.create({ name: "rsvp_form" })(UnwrappedRSVPForm);
