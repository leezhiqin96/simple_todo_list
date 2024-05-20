import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './styles/common.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
        <Route 
            path={'/'} 
            element={
                <></>
            } 
        />
    </Routes>
  </Router>
);
