import React, { useState } from "react";
import { Stack, Table, Input, SelectPicker, IconButton, DatePicker, Checkbox } from "rsuite";
import { faChevronRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";

const { Cell } = Table;

export const TaskTitleCell = ({ rowData, dataKey, showIcon, selectedTask, onSelect, onBlur, ...props }) => {
  const [value, setValue] = useState(rowData[dataKey]);

  const isSelected = selectedTask == rowData.id;

  const icon = (
    <FontAwesomeIcon icon={isSelected ? faChevronDown : faChevronRight} />
  )

  const handleBlur = () => {
    if (value !== rowData[dataKey]) {
      onBlur(rowData.id, dataKey, value);
    }
  };

  const handleExpand = () => {
    // If not selected, select task, else unselect
    onSelect(isSelected ? null : rowData.id)
  }

  return (
    <Cell {...props}>
      <Stack spacing={4}>
        {showIcon && (
          <IconButton
            icon={icon}
            appearance="link"
            onClick={handleExpand}
          />
        )}
        <Input
          className="editable-cell-input"
          value={value}
          size="sm"
          onChange={(value) => setValue(value)}
          onBlur={handleBlur}
        />
      </Stack>
    </Cell>
  )
};

export const DropDownCell = ({ rowData, dataKey, options, defaultValue, onChange, ...props }) => {
  const handleChange = (value) => {
    if (value !== rowData[dataKey]) {
      onChange(rowData.id, dataKey, value);
    }
  };

  return (
    <Cell {...props}>
      <SelectPicker
        appearance="subtle"
        value={rowData[dataKey] || defaultValue}
        data={options}
        searchable={false}
        cleanable={false}
        block
        style={{ flexGrow: 1 }}
        onChange={handleChange}
      />
    </Cell>
  )
}

export const DatePickerCell = ({ rowData, dataKey, onChange, placeholder, ...props }) => {
  const date = rowData[dataKey]
    ? DateTime.fromISO(rowData[dataKey]).toJSDate() : null;

  const handleChange = (value) => {
    if (value !== rowData[dataKey]) {
      onChange(rowData.id, dataKey, value);
    }
  };

  return (
    <Cell {...props}>
      <DatePicker
        appearance="subtle"
        value={date}
        block
        onChange={handleChange}
        placeholder={placeholder}
      />
    </Cell>
  )
}

export const DateCell = ({ rowData, dataKey, ...props }) => {
  const displayDate = DateTime.fromISO(rowData[dataKey]).toFormat('yyyy-MM-dd h:mm a');

  return <Cell {...props}>{displayDate}</Cell>
}

export const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
  <Cell style={{ padding: "0 10px 0px 5px" }} {...props}>
    <Checkbox
      value={rowData[dataKey]}
      inline
      onChange={onChange}
      checked={checkedKeys.some(item => item === rowData[dataKey])}
    />
  </Cell>
);
