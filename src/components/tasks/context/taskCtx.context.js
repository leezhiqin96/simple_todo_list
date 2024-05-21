import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

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
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload.id),
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
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};


export const TaskContext = createContext({
  userTasks: [],
  addTask: async (title) => null,
  updateTask: async (title) => null
});

export default function TaskContextProvider({ children }) {
  const [userTasks, dispatchTasks] = useReducer(tasksReducer, { tasks: [], loading: false });

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
      const addTaskResult = await axios.post(`/users/${userID}/tasks`, { taskTitle: title }, {
        headers: { 'X-CSRF-Token': csrfToken }
      });
      dispatchTasks({ type: 'ADD_TASK', payload: addTaskResult.data.newTask });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (rowID, field, value) => {
    const payload = { id: rowID, field, value };
    try {
      const updateTaskResult = await axios.put(`/users/${userID}/tasks/${rowID}`, payload, {
        headers: { 'X-CSRF-Token': csrfToken }
      });
      dispatchTasks({ type: 'UPDATE_TASK', payload: updateTaskResult.data.updatedTask });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      dispatchTasks({ type: 'DELETE_TASK', payload: { id: taskId } });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const ctxValue = {
    userTasks: userTasks,
    addTask: addTask,
    updateTask: updateTask
  }

  return (
    <TaskContext.Provider value={ctxValue}>{children}</TaskContext.Provider>
  )
}
