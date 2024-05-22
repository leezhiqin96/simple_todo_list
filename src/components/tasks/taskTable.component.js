import React, { useState, useContext } from "react";
import { Panel, Table, Input, Checkbox, Stack, IconButton, useToaster, Message } from "rsuite";
import { TaskContext } from "./context/taskCtx.context";
import { faChevronRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrashIcon from '@rsuite/icons/Trash';

import { DateCell, DatePickerCell, EditableCell, DropDownCell, CheckCell } from "./customCells.component";

const { Column, HeaderCell } = Table;
const statusDropDown = ["Done", "Not Started", "Stucked", "Working on it"].map((item) => ({ label: item, value: item }));
const priorityDropDown = ["Low", "Medium", "High"].map((item) => ({ label: item, value: item }));

const renderMessageBox = (type, message) => {
  return (
    <Message showIcon type={type} closable>
      {message}
    </Message>
  )
}

export default function TaskTable() {
  const { userTasks, addTask, updateTask, deleteTasks } = useContext(TaskContext);
  const [expanded, setExpanded] = useState(false);
  const [checkedKeys, setCheckKeys] = useState([]);

  const toaster = useToaster();

  // Checkbox logic ===========================================================
  let headerChecked = false;
  let indeterminate = false;
  if ((checkedKeys.length === userTasks.tasks.length) && userTasks.tasks.length !== 0) {
    headerChecked = true;
  } else if (checkedKeys.length === 0) {
    headerChecked = false;
  } else if (checkedKeys.length > 0 && checkedKeys.length < userTasks.tasks.length) {
    indeterminate = true;
  }

  // Handle Events ============================================================
  const handleCheckAll = (value, headerChecked) => {
    const keys = headerChecked ? userTasks.tasks.map(item => item.id) : [];
    setCheckKeys(keys)
  };
  const handleCheck = (value, checked) => {
    const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
    setCheckKeys(keys)
  };

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

  const handleDeleteTask = async () => {
    try {
      const deleteResult = await deleteTasks(checkedKeys);
      toaster.push(renderMessageBox("success", deleteResult.data.message), { placement: "topCenter", duration: 2000 });

      setCheckKeys([]);
    } catch (error) {
      toaster.push(renderMessageBox("error", error.response.data.message), { placement: "topCenter", duration: 2000 });
    }
  }

  return (
    <>
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
          <Column verticalAlign="middle" width={50} fixed>
            <HeaderCell style={{ padding: "0 10px 0px 5px" }}>
              <Checkbox
                checked={headerChecked}
                indeterminate={indeterminate}
                onChange={handleCheckAll}
              />
            </HeaderCell>
            <CheckCell dataKey="id" checkedKeys={checkedKeys} onChange={handleCheck} />
          </Column>


          <Column minWidth={200} flexGrow={2} fixed verticalAlign="middle" resizable>
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
              onPressEnter={handleAddNewTask}
            />
          </div>
        </div>
      </Panel>

      {checkedKeys.length > 0 && (
        < Panel className="pop-up-card" bordered shaded>
          <Stack spacing={10}>
            <Stack.Item className="card-box">
              <h2>{checkedKeys.length}</h2>
            </Stack.Item>
            <Stack.Item flex={1}>
              <p>{checkedKeys.length > 1 ? 'Tasks' : 'Task'} Selected</p>
            </Stack.Item>
            <Stack.Item>
              <IconButton
                appearance="subtle"
                icon={<TrashIcon />}
                onClick={handleDeleteTask}
              />
            </Stack.Item>
          </Stack>
        </Panel >
      )}
    </>
  )
}
