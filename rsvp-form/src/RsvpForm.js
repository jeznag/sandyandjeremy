import React from "react";
import { Button, Divider, Form, Input, Select } from "antd";

import { FieldArray } from "./components/FieldArray";

const validateAndSubmit = (e, validateFields, submitHandler) => {
  e.preventDefault();
  validateFields((err, values) => {
    if (!err) {
      debugger;
      submitHandler(values);
    }
  });
};

const UnwrappedRSVPForm = props => {
  const { form } = props;

  return (
    <Form
      onSubmit={e => validateAndSubmit(e, props.form.validateFields, props.onSubmit)}
    >
      {/* TODO show event details */}
      <Divider orientation="left" className="first">
        Who's coming along?
      </Divider>
      <FieldArray
        {...form}
        name="guests"
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
      <Divider orientation="left" className="first">
        We'd love your help to make the ceremony awesome. How can you help?
      </Divider>
      <FieldArray
        {...form}
        name="roles"
        fields={[
          {
            name: "roleName",
            field: () => (
              <Select placeholder="Role">
                <Select.Option value="photographer">Photography</Select.Option>
                <Select.Option value="catering">Catering</Select.Option>
                <Select.Option value="dance_teacher">
                  Dance teaching
                </Select.Option>
              </Select>
            )
          },
          {
            name: "details",
            field: () => <Input.TextArea rows={4} placeholder={"Details"} />
          }
        ]}
      />
      <Button type="primary" htmlType="submit">
        RSVP
      </Button>
    </Form>
  );
};

export const RsvpForm = Form.create({ name: "rsvp_form" })(UnwrappedRSVPForm);
