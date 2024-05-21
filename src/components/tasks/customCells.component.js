import React, { useState } from "react";
import { Stack, Table, Input, SelectPicker, IconButton, DatePicker } from "rsuite";
import { DateTime } from "luxon";

const { Cell } = Table;

export const EditableCell = ({ rowData, dataKey, icon, onExpand, onBlur, ...props }) => {
  const [value, setValue] = useState(rowData[dataKey]);

  const handleBlur = () => {
    if (value !== rowData[dataKey]) {
      onBlur(rowData.id, dataKey, value);
    }
  };

  return (
    <Cell {...props}>
      <Stack spacing={4}>
        {icon && (
          <IconButton
            icon={icon}
            appearance="link"
            onClick={onExpand}
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
