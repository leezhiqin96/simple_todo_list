import React, { useState, useContext } from "react";
import { Stack, Panel, Table, Input, SelectPicker, IconButton } from "rsuite";
import { TaskContext } from "./taskCtx.context";
import { faChevronRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { Column, HeaderCell, Cell } = Table

const EditableCell = ({ rowData, dataKey, icon, onExpand, ...props }) => {
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
                    value={rowData[dataKey]}
                    size="sm"
                />
            </Stack>
        </Cell>
    )
}

const statusDropDown = ["Done", "Not Started", "Stucked", "Working on it"].map((item) => ({ label: item, value: item }));
const priorityDropDown = ["Low", "Medium", "High"].map((item) => ({ label: item, value: item }));

const DropDownCell = ({ rowData, dataKey, options, defaultValue, ...props }) => {
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
            />
        </Cell>
    )
}

export default function TaskTable() {
    const { userTasks } = useContext(TaskContext);
    const [expanded, setExpanded] = useState(false);

    const handleAddNewTask = (event) => {
        const value = event.target.value;
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
            >
                <Column flexGrow={1} verticalAlign="middle">
                    <HeaderCell>Task</HeaderCell>
                    <EditableCell
                        dataKey="title"
                        icon={<FontAwesomeIcon icon={expanded ? faChevronDown : faChevronRight} />}
                        onExpand={() => setExpanded(!expanded)}
                    />
                </Column>

                <Column flexGrow={1} verticalAlign="middle">
                    <HeaderCell>Due Date</HeaderCell>
                    <Cell dataKey="dueDate" />
                </Column>

                <Column flexGrow={1} verticalAlign="middle">
                    <HeaderCell>Status</HeaderCell>
                    <DropDownCell dataKey="status" options={statusDropDown} defaultValue="Not Started" />
                </Column>

                <Column flexGrow={1} verticalAlign="middle">
                    <HeaderCell>Priority</HeaderCell>
                    <DropDownCell dataKey="priority" options={priorityDropDown} defaultValue="Low" />
                </Column>

                <Column flexGrow={1} verticalAlign="middle">
                    <HeaderCell>Last Updated</HeaderCell>
                    <Cell dataKey="updatedAt" />
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