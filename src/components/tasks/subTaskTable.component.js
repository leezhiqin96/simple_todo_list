import React, { useContext } from "react";
import { Stack, Table, Input, Checkbox } from "rsuite";
import { DatePickerCell, TaskTitleCell, DropDownCell, CheckCell } from "./customCells.component";
import { TaskContext } from "./context/taskCtx.context";

const { Column, HeaderCell } = Table;

const statusDropDown = ["Done", "Not Started", "Stucked", "Working on it"].map((item) => ({ label: item, value: item }));
const priorityDropDown = ["Low", "Medium", "High"].map((item) => ({ label: item, value: item }));

const SubTaskTable = ({ data, handleSubtaskCheck, subtaskCheckedKeys, setSubtaskCheckedKeys }) => {
  const { addSubTask, userTasks, updateTask, deleteTasks } = useContext(TaskContext);

  // Checkbox logic ===========================================================
  let headerChecked = false;
  let indeterminate = false;
  if ((subtaskCheckedKeys.length === data.length) && data.length !== 0) {
    headerChecked = true;
  } else if (subtaskCheckedKeys.length === 0) {
    headerChecked = false;
  } else if (subtaskCheckedKeys.length > 0 && subtaskCheckedKeys.length < data.length) {
    indeterminate = true;
  }

  const handleCheckAllSubtasks = (value, headerChecked) => {
    const keys = headerChecked ? data.map(item => item.id) : [];
    setSubtaskCheckedKeys(keys)
  }

  const handleAddNewSubtask = async (event) => {
    const taskTitle = event.target.value;
    if (taskTitle) {
      await addSubTask(userTasks.selectedTask, taskTitle);
      event.target.value = '';
    }
  }

  const handleUpdateSubtask = async (rowID, field, value) => {
    try {
      await updateTask(rowID, field, value, userTasks.selectedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  return (
    <Stack direction="column" alignItems="stretch" style={{ width: '100%', height: '100%' }}>
      <Stack.Item flex={1}>
        <Table
          data={data}
          bordered
          cellBordered
          fillHeight
          rowHeight={60}
          rowKey="id"
        >
          <Column verticalAlign="middle" width={50} fixed>
            <HeaderCell style={{ padding: "0 10px 0px 5px" }}>
              <Checkbox
                checked={headerChecked}
                indeterminate={indeterminate}
                onChange={handleCheckAllSubtasks}
              />
            </HeaderCell>
            <CheckCell dataKey="id" checkedKeys={subtaskCheckedKeys} onChange={handleSubtaskCheck} />
          </Column>

          <Column minWidth={200} flexGrow={1} fixed verticalAlign="middle" resizable>
            <HeaderCell>Subtask</HeaderCell>
            <TaskTitleCell
              dataKey="title"
              onBlur={handleUpdateSubtask}
            />
          </Column>

          <Column width={150} resizable verticalAlign="middle">
            <HeaderCell>Due Date</HeaderCell>
            <DatePickerCell
              dataKey="dueDate"
              placeholder={" "}
              onChange={handleUpdateSubtask}
            />
          </Column>

          <Column width={200} resizable verticalAlign="middle">
            <HeaderCell>Status</HeaderCell>
            <DropDownCell
              dataKey="status"
              options={statusDropDown}
              defaultValue="Not Started"
              onChange={handleUpdateSubtask}
            />
          </Column>

          <Column width={200} resizable verticalAlign="middle">
            <HeaderCell>Priority</HeaderCell>
            <DropDownCell
              dataKey="priority"
              options={priorityDropDown}
              defaultValue="Low"
              onChange={handleUpdateSubtask}
            />
          </Column>
        </Table>
      </Stack.Item>

      <Stack.Item>
        <div className="input-table-row">
          <div className="rs-table-body-row-wrapper">
            <Input
              className="editable-cell-input"
              placeholder="+ Add Subtask"
              onBlur={handleAddNewSubtask}
              onPressEnter={handleAddNewSubtask}
            />
          </div>
        </div>
      </Stack.Item>
    </Stack>
  )
};

export default SubTaskTable;
