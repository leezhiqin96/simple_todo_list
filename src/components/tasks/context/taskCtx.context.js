import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;

const tasksReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASKS':
      return {
        ...state,
        tasks: state.tasks.filter(task => !action.payload.idList.includes(task.id)),
      };
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };
    case 'LOAD_TASKS':
      return {
        ...state,
        loading: action.payload
      }
    case 'SELECT_TASK':
      return {
        ...state,
        selectedTask: action.payload
      }
    case 'ADD_SUB_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskID
            ? { ...task, subtasks: [...task.subtasks, action.payload.subtask] }
            : task
        ),
      };
    case 'UPDATE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.id === action.payload.parentTaskID) {
            return {
              ...task,
              subtasks: task.subtasks.map(subtask =>
                subtask.id === action.payload.updatedSubtask.id ? action.payload.updatedSubtask : subtask
              )
            };
          }
          return task;
        }),
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};


export const TaskContext = createContext({
  userTasks: [],
  addTask: async (title) => { },
  updateTask: async (rowID, field, value) => null,
  deleteTasks: async (tasksIDList) => { },
  selectTask: () => { },
  addSubTask: async (title) => { }
});

export default function TaskContextProvider({ children }) {
  const [userTasks, dispatchTasks] = useReducer(tasksReducer,
    {
      tasks: [],
      loading: false,
      selectedTask: null
    }
  );

  useEffect(() => {
    fetchUserTasks();
  }, [])

  const fetchUserTasks = async () => {
    setLoading(true);
    try {
      const userTasksList = await axios.get(`/users/${userID}/tasks`);
      setTasks(userTasksList.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const setTasks = (tasks) => {
    dispatchTasks({ type: 'SET_TASKS', payload: tasks });
  };

  const setLoading = (loading) => {
    dispatchTasks({ type: 'LOAD_TASKS', payload: loading });
  }

  const addTask = async (title) => {
    try {
      const addTaskResult = await axios.post(`/users/${userID}/tasks`, { taskTitle: title });
      dispatchTasks({ type: 'ADD_TASK', payload: addTaskResult.data.newTask });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const addSubTask = async (taskID, title) => {
    try {
      const addTaskResult = await axios.post(`/users/${userID}/tasks/${taskID}`, { taskTitle: title });
      dispatchTasks({ type: 'ADD_SUB_TASK', payload: { taskID, subtask: addTaskResult.data.newTask } });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  const updateTask = async (rowID, field, value, parentTaskID = null) => {
    const payload = { id: rowID, field, value };

    try {
      const updateTaskResult = await axios.put(`/users/${userID}/tasks/${rowID}`, payload);
      const updatedTask = updateTaskResult.data.updatedTask;

      if (parentTaskID) {
        dispatchTasks({ type: 'UPDATE_SUBTASK', payload: { parentTaskID, updatedSubtask: updatedTask } });
      } else {
        dispatchTasks({ type: 'UPDATE_TASK', payload: updatedTask });
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };


  const deleteTasks = (tasksIDList) => {
    return new Promise((resolve, reject) => {
      axios.delete(`/users/${userID}/tasks`, { data: tasksIDList })
        .then((deleteTasksResult) => {
          dispatchTasks({ type: 'DELETE_TASKS', payload: { idList: tasksIDList } });
          resolve(deleteTasksResult);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const selectTask = (taskID) => {
    dispatchTasks({ type: 'SELECT_TASK', payload: taskID });
  }

  const ctxValue = {
    userTasks,
    addTask,
    updateTask,
    deleteTasks,
    selectTask,
    addSubTask
  }

  return (
    <TaskContext.Provider value={ctxValue}>{children}</TaskContext.Provider>
  )
}
