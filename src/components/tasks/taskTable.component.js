import React, { useState, useContext } from "react";
import { Panel, Table, Input } from "rsuite";
import { TaskContext } from "./context/taskCtx.context";
import { faChevronRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateCell, DatePickerCell, EditableCell, DropDownCell } from "./customCells.component";

const { Column, HeaderCell } = Table;
const statusDropDown = ["Done", "Not Started", "Stucked", "Working on it"].map((item) => ({ label: item, value: item }));
const priorityDropDown = ["Low", "Medium", "High"].map((item) => ({ label: item, value: item }));

export default function TaskTable() {
  const { userTasks, addTask, updateTask } = useContext(TaskContext);
  const [expanded, setExpanded] = useState(false);

  const handleAddNewTask = async (event) => {
    const taskTitle = event.target.value;
    if (taskTitle) {
      await addTask(taskTitle);
      event.target.value = '';

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
          <DatePickerCell
            dataKey="dueDate"
            onChange={handleUpdateTask}
            placeholder={" "}
          />
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
