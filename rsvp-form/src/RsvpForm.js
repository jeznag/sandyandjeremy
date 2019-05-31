import React, { Fragment } from "react";
import { Button, Divider, Form, Input, Select } from "antd";

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
          return `${dataForThisRow.roleName || ""}`;
        }}
        fields={[
          {
            name: "roleName",
            field: () => (
              <Select placeholder="Role">
                {eventData.help_needed.map(availableRole => (
                  <Select.Option
                    key={availableRole.role_type}
                    value={availableRole.role_type}
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
      <p>Venue: {eventData.event_venue}</p>
      <p>Date: {eventData.event_date}</p>
      <p>Time: {eventData.event_time}</p>
      <p>Other details: {eventData.event_description}</p>
    </div>
  );
};

const UnwrappedRSVPForm = props => {
  const { form, eventData } = props;

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
