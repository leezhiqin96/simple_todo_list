import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import './styles/common.scss';
import './styles/login.scss';

import LoginForm from "./components/loginForm.component";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <LoginForm />
  </BrowserRouter>
);
