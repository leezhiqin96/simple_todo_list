import React, { useState, useContext } from "react";
import { Stack, Panel, Table, Input, SelectPicker, IconButton, DatePicker } from "rsuite";
import { TaskContext } from "./context/taskCtx.context";
import { faChevronRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";

const { Column, HeaderCell, Cell } = Table
const statusDropDown = ["Done", "Not Started", "Stucked", "Working on it"].map((item) => ({ label: item, value: item }));
const priorityDropDown = ["Low", "Medium", "High"].map((item) => ({ label: item, value: item }));

const EditableCell = ({ rowData, dataKey, icon, onExpand, onBlur, ...props }) => {
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

const DropDownCell = ({ rowData, dataKey, options, defaultValue, onChange, ...props }) => {
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

const DatePickerCell = ({ rowData, dataKey, onChange, ...props }) => {
  const date = DateTime.fromISO(rowData[dataKey]).toJSDate();

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
      />
    </Cell>
  )
}

const DateCell = ({ rowData, dataKey, ...props }) => {
  const displayDate = DateTime.fromISO(rowData[dataKey]).toFormat('yyyy-MM-dd h:mm a');

  return <Cell {...props}>{displayDate}</Cell>
}

export default function TaskTable() {
  const { userTasks, addTask, updateTask } = useContext(TaskContext);
  const [expanded, setExpanded] = useState(false);

  const handleAddNewTask = async (event) => {
    const taskTitle = event.target.value;
    if (taskTitle) {
      const successful = await addTask(taskTitle);
      if (successful) {
        event.target.value = '';
      }
    }
  }

  const handleUpdateTask = async (rowID, field, value) => {
    try {
      await updateTask(rowID, field, value);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  return (
    <Panel header="Simple To Do">
      <Table
        data={userTasks.tasks}
        loading={userTasks.loading}
        bordered
        cellBordered
        autoHeight
        rowHeight={60}
        rowKey="id"
        affixHeader
        affixHorizontalScrollbar
      >
        <Column flexGrow={2} fixed verticalAlign="middle">
          <HeaderCell>Task</HeaderCell>
          <EditableCell
            dataKey="title"
            icon={<FontAwesomeIcon icon={expanded ? faChevronDown : faChevronRight} />}
            onExpand={() => setExpanded(!expanded)}
            onBlur={handleUpdateTask}
          />
        </Column>

        <Column width={150} resizable verticalAlign="middle">
          <HeaderCell>Due Date</HeaderCell>
          <DatePickerCell dataKey="dueDate" onChange={handleUpdateTask} />
        </Column>

        <Column width={150} resizable verticalAlign="middle">
          <HeaderCell>Status</HeaderCell>
          <DropDownCell
            dataKey="status"
            options={statusDropDown}
            defaultValue="Not Started"
            onChange={handleUpdateTask}
          />
        </Column>

        <Column width={150} resizable verticalAlign="middle">
          <HeaderCell>Priority</HeaderCell>
          <DropDownCell
            dataKey="priority"
            options={priorityDropDown}
            defaultValue="Low"
            onChange={handleUpdateTask}
          />
        </Column>

        <Column width={150} resizable verticalAlign="middle">
          <HeaderCell>Last Updated</HeaderCell>
          <DateCell dataKey="updatedAt" />
        </Column>
      </Table>
      <div role="row" className="input-table-row">
        <div className="rs-table-body-row-wrapper">
          <Input
            className="editable-cell-input"
            placeholder="+ Add Task"
            htmlSize={10}
            onBlur={handleAddNewTask}
          />
        </div>
      </div>
    </Panel>
  )
}
