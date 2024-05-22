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
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};


export const TaskContext = createContext({
  userTasks: [],
  addTask: async (title) => null,
  updateTask: async (title) => null,
  deleteTasks: async (tasksIDList) => { }
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

  const updateTask = async (rowID, field, value) => {
    const payload = { id: rowID, field, value };
    try {
      const updateTaskResult = await axios.put(`/users/${userID}/tasks/${rowID}`, payload);
      dispatchTasks({ type: 'UPDATE_TASK', payload: updateTaskResult.data.updatedTask });
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
    selectTask
  }

  return (
    <TaskContext.Provider value={ctxValue}>{children}</TaskContext.Provider>
  )
}
