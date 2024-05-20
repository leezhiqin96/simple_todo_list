import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskContextProvider from "./components/tasks/context/taskCtx.context";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route
        path={'/'}
        element={
          <TaskContextProvider>
            <></>
          </TaskContextProvider>
        }
      />
    </Routes>
  </Router>
);
