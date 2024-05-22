import React, { forwardRef, useContext } from "react";
import { Stack, Table, Input } from "rsuite";
import { DateCell, DatePickerCell, TaskTitleCell, DropDownCell, CheckCell } from "./customCells.component";
import { TaskContext } from "./context/taskCtx.context";

const { Column, HeaderCell } = Table;

const statusDropDown = ["Done", "Not Started", "Stucked", "Working on it"].map((item) => ({ label: item, value: item }));
const priorityDropDown = ["Low", "Medium", "High"].map((item) => ({ label: item, value: item }));

const SubTaskTable = forwardRef(({ data }, ref) => {
  const { addSubTask, userTasks } = useContext(TaskContext);

  const handleAddNewSubtask = async (event) => {
    const taskTitle = event.target.value;
    if (taskTitle) {
      await addSubTask(userTasks.selectedTask, taskTitle);
      event.target.value = '';
    }
  }

  return (
    <Stack direction="column" alignItems="stretch">
      <Stack.Item style={{ width: '100%' }}>
        <Table
          data={data}
          bordered
          cellBordered
          autoHeight
          rowHeight={60}
          rowKey="id"
          affixHeader
          affixHorizontalScrollbar
          ref={ref}
        >
          {/* <Column verticalAlign="middle" width={50} fixed>
              <HeaderCell style={{ padding: "0 10px 0px 5px" }}>
                <Checkbox
                  checked={headerChecked}
                  indeterminate={indeterminate}
                  onChange={handleCheckAll}
                />
              </HeaderCell>
              <CheckCell dataKey="id" checkedKeys={checkedKeys} onChange={handleCheck} />
            </Column> */}

          <Column minWidth={200} flexGrow={2} fixed verticalAlign="middle" resizable>
            <HeaderCell>Subtask</HeaderCell>
            <TaskTitleCell
              dataKey="title"
            // onSelect={selectTask}
            // onBlur={handleUpdateTask}
            />
          </Column>

          <Column width={150} resizable verticalAlign="middle">
            <HeaderCell>Due Date</HeaderCell>
            <DatePickerCell
              dataKey="dueDate"
              placeholder={" "}
            // onChange={handleUpdateTask}
            />
          </Column>

          <Column width={150} resizable verticalAlign="middle">
            <HeaderCell>Status</HeaderCell>
            <DropDownCell
              dataKey="status"
              options={statusDropDown}
              defaultValue="Not Started"
            // onChange={handleUpdateTask}
            />
          </Column>

          <Column width={150} resizable verticalAlign="middle">
            <HeaderCell>Priority</HeaderCell>
            <DropDownCell
              dataKey="priority"
              options={priorityDropDown}
              defaultValue="Low"
            // onChange={handleUpdateTask}
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
            />
          </div>
        </div>
      </Stack.Item>
    </Stack>
  )
});

export default SubTaskTable;
