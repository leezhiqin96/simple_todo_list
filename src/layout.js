import React from "react";
import ReactDOM from "react-dom/client";

import './styles/common.scss';
import './styles/navbar.scss';

import SideNavBar from "./components/layout/sideNavBar.component";

const navbarElement = document.getElementById('side-nav');
if (navbarElement) {
    const navbar = ReactDOM.createRoot(navbarElement);
    navbar.render(<SideNavBar />);
}