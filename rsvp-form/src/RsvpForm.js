import React from "react";
import { Field, FieldArray, reduxForm } from "redux-form";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

const renderTextField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <TextField {...input} type={type} label={label} placeholder={label} />
    {touched && error && <span>{error}</span>}
  </div>
);

const renderFormHelper = ({ touched, error }) => {
  if (!(touched && error)) {
    return;
  } else {
    return <FormHelperText>{touched && error}</FormHelperText>;
  }
};

const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <FormControl error={touched && error}>
    <InputLabel htmlFor={`select-native-simple-${label}`}>{label}</InputLabel>
    <Select
      native
      {...input}
      {...custom}
      inputProps={{
        name: label,
        id: `select-native-simple-${label}`
      }}
    >
      {children}
    </Select>
    {renderFormHelper({ touched, error })}
  </FormControl>
);

const renderRoles = ({ fields, meta: { error } }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push()}>
        Add Role
      </button>
    </li>
    {fields.map((role, index) => (
      <li key={index}>
        <button
          type="button"
          title="Remove Role"
          onClick={() => fields.remove(index)}
        />
        <Field
          name="roleName"
          component={renderSelectField}
          label="How will you help?"
        >
          <option value="" />
          <option value="catering-food">Catering - food</option>
          <option value="catering-drink">Catering - drinks</option>
          <option value="photography">Photography</option>
          <option value="music">Music</option>
          <option value="speech">Give a speech</option>
          <option value="dance-lessons">Provide dance lessons to party goers</option>
          <option value="av-equipment">Provide AV equipment</option>
          <option value="other">Something else</option>
        </Field>
        <Field
          name={role}
          type="text"
          component={renderTextField}
          label={`Details for role #${index + 1}`}
        />
      </li>
    ))}
    {error && <li className="error">{error}</li>}
  </ul>
);

const renderGuests = ({ fields, meta: { error, submitFailed } }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>
        Add Guest
      </button>
      {submitFailed && error && <span>{error}</span>}
    </li>
    {fields.map((guest, index) => (
      <li key={index}>
        <button
          type="button"
          title="Remove Guest"
          onClick={() => fields.remove(index)}
        />
        <h4>Guest #{index + 1}</h4>
        <Field
          name={`${guest}.firstName`}
          type="text"
          component={renderTextField}
          label="First Name"
        />
        <Field
          name={`${guest}.lastName`}
          type="text"
          component={renderTextField}
          label="Last Name"
        />
        <Field
          name={`${guest}.email`}
          type="text"
          component={renderTextField}
          label="Email"
        />
        <Field
          name={`${guest}.phone`}
          type="text"
          component={renderTextField}
          label="Phone"
        />
        <Field
          name={`${guest}.dietaryRequirements`}
          type="text"
          component={renderTextField}
          label="Dietary Requirements"
        />
        <FieldArray name={`${guest}.Roles`} component={renderRoles} />
      </li>
    ))}
  </ul>
);

const RsvpForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="eventName"
        type="text"
        component={renderTextField}
        label="Ceremony"
        disabled
      />
      <FieldArray name="guests" component={renderGuests} />
      <div>
        <button type="submit" disabled={submitting}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: "rsvps"
})(RsvpForm);
