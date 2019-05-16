// from https://codesandbox.io/s/jnpjpj2p55

import React, { Component, Fragment } from "react";
import { Form, Icon, Button, Collapse } from "antd";
import PropTypes from "prop-types";

const { Panel } = Collapse;

export class FieldArray extends Component {
  id = 1;

  add = () => {
    const { getFieldValue, setFieldsValue, name } = this.props,
      keys = getFieldValue(`${name}List`),
      nextKeys = keys.concat(this.id++);

    setFieldsValue({
      [`${name}List`]: nextKeys
    });
  };

  remove = k => () => {
    const { getFieldValue, setFieldsValue, name } = this.props,
      keys = getFieldValue(`${name}List`);

    if (keys.length === 1) return;
    setFieldsValue({
      [`${name}List`]: keys.filter(key => key !== k)
    });
  };

  defaultValidation = name => ({
    validateTrigger: ["onChange", "onBlur"],
    rules: [
      {
        required: true,
        whitespace: true,
        message: `Please fill this out.`
      }
    ]
  });

  addSingleField = () => {
    const { getFieldDecorator, getFieldValue, fields: obj, name } = this.props;
    getFieldDecorator(`${name}List`, { initialValue: [0] });
    const fieldCounter = getFieldValue(`${name}List`);
    return fieldCounter.map(k => (
      <Form.Item key={k}>
        {getFieldDecorator(
          `${name}[${k}]`,
          obj.validation || this.defaultValidation(name)
        )(obj.field())}
        {fieldCounter.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
  };

  addMultipleFields = () => {
    const { getFieldDecorator, getFieldValue, fields, name } = this.props;
    getFieldDecorator(`${name}List`, { initialValue: [0] });
    const fieldCounter = getFieldValue(`${name}List`);

    const rows = fieldCounter.reduce((preResult, rowIdx) => {
      const row = fields.map((obj, i) => (
        <Form.Item key={`${rowIdx}${obj.name}`}>
          {getFieldDecorator(
            `${name}[${rowIdx}][${obj.name}]`,
            obj.validation || this.defaultValidation(name)
          )(obj.field())}
          {fieldCounter.length > 1 && fields.length - 1 === i ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={this.remove(rowIdx)}
            />
          ) : null}
        </Form.Item>
      ));

      const RowWithPanel = (
        <Panel header="TODO" key={rowIdx}>
          {row}
        </Panel>
      );

      return [...preResult, RowWithPanel];
    }, []);

    return <Collapse defaultActiveKey={[0]}>{rows}</Collapse>;
  };

  render() {
    const { fields, name } = this.props;
    return (
      <Fragment>
        {Array.isArray(fields)
          ? this.addMultipleFields()
          : this.addSingleField()}
        <Form.Item>
          <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
            <Icon type="plus" /> Add &nbsp; {name}
          </Button>
        </Form.Item>
      </Fragment>
    );
  }
}

FieldArray.propTypes = {
  name: PropTypes.string.isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
    //TODO: add object shape validation.
  ]).isRequired,
  getFieldValue: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired
};
