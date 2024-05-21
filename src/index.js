import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskContextProvider from "./components/tasks/context/taskCtx.context";

import TaskTable from "./components/tasks/context/taskTable.component";
import './styles/tasks.scss'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route
        path={'/'}
        element={
          <TaskContextProvider>
            <TaskTable />
          </TaskContextProvider>
        }
      />
    </Routes>
  </Router>
);
