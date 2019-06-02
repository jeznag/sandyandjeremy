// from https://codesandbox.io/s/jnpjpj2p55

import React, { Component, Fragment } from "react";
import { Form, Icon, Button, Collapse } from "antd";
import PropTypes from "prop-types";

const { Panel } = Collapse;

export class FieldArray extends Component {
  id = 1;

  add = () => {
    const { getFieldValue, setFieldsValue, name } = this.props;
    const { keys } = getFieldValue(`${name}List`);
    const newRowKey = this.id++;
    const nextKeys = keys.concat(newRowKey);

    setFieldsValue({
      [`${name}List`]: {
        keys: nextKeys,
        openPanels: [newRowKey.toString()]
      }
    });
  };

  remove = keyToRemove => () => {
    const { getFieldValue, setFieldsValue, name } = this.props;
    const { keys, openPanels } = getFieldValue(`${name}List`);

    if (keys.length === 1) return;
    setFieldsValue({
      [`${name}List`]: {
        keys: keys.filter(key => key !== keyToRemove),
        openPanels: openPanels.filter(panelKey => panelKey !== keyToRemove)
      }
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

  handlePanelChange = openPanels => {
    const { getFieldValue, setFieldsValue, name } = this.props;
    const { keys } = getFieldValue(`${name}List`);

    setFieldsValue({
      [`${name}List`]: {
        keys,
        openPanels
      }
    });
  };

  getFieldArrayRows = () => {
    const {
      getFieldDecorator,
      getFieldValue,
      fields,
      name,
      initialValue
    } = this.props;
    const initialPanelValues = initialValue
      ? initialValue.reduce(
          (result, fieldArrayData, idx) => ({
            keys: result.keys.concat(idx),
            openPanels: result.openPanels.concat(idx.toString())
          }),
          {
            keys: [],
            openPanels: []
          }
        )
      : {
          keys: [0],
          openPanels: ["0"]
        };
    getFieldDecorator(`${name}List`, {
      initialValue: initialPanelValues
    });
    const { keys, openPanels } = getFieldValue(`${name}List`);

    const rows = keys.reduce((preResult, rowKey) => {
      const row = fields.map((fieldData, i) => {
        const initialValueForField = initialValue && initialValue[rowKey][fieldData.name];
        return (<Form.Item key={`${rowKey}${fieldData.name}`}>
          {getFieldDecorator(`${name}[${rowKey}][${fieldData.name}]`, {
            initialValue: initialValueForField,
            validate: fieldData.validation || [this.defaultValidation(name)]
          })(fieldData.field())}
          {keys.length > 1 && fields.length - 1 === i ? (
            <Fragment>
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={this.remove(rowKey)}
              />
              {` Remove`}
            </Fragment>
          ) : null}
        </Form.Item>
      )
      });
      const panelName = this.props.panelName(getFieldValue(name)[rowKey]);

      const RowWithPanel = (
        <Panel header={panelName} key={rowKey}>
          {row}
        </Panel>
      );

      return [...preResult, RowWithPanel];
    }, []);

    return (
      <Collapse onChange={this.handlePanelChange} activeKey={openPanels}>
        {rows}
      </Collapse>
    );
  };

  render() {
    const { name } = this.props;
    return (
      <Fragment>
        {this.getFieldArrayRows()}
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
