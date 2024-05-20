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
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};


export const TaskContext = createContext({
  userTasks: []
});

export default function TaskContextProvider({ children }) {
  const [userTasks, dispatchTasks] = useReducer(tasksReducer, []);

  useEffect(() => {
    fetchUserTasks();
  }, [])

  const fetchUserTasks = async () => {
    try {
      const userTasksList = await axios.get(`/users/${userID}/tasks`);
      setTasks(userTasksList.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const setTasks = (tasks) => {
    dispatchTasks({ type: 'SET_TASKS', payload: tasks });
  };


  const addTask = async (task) => {
    try {
      const response = await axios.post('/tasks', task);
      dispatchTasks({ type: 'ADD_TASK', payload: response.data });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (task) => {
    try {
      const response = await axios.put(`/tasks/${task.id}`, task);
      dispatchTasks({ type: 'UPDATE_TASK', payload: response.data });
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
    userTasks: userTasks
  }

  return (
    <TaskContext.Provider value={ctxValue}>{children}</TaskContext.Provider>
  )
}
