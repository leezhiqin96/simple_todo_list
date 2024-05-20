import React, { useState, useEffect } from "react";
import { Sidenav, Nav, useToaster } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const renderMessageBox = (type, message) => {
  return (
    <Message showIcon type={type} closable>
      {message}
    </Message>
  )
}

export default function SideNavBar() {
  const [expanded, setExpanded] = useState(true);
  const toaster = useToaster(null);

  const handleLogout = async () => {
    try {
      const logoutResult = await axios.post('/logout', {}, { headers: { 'X-CSRF-Token': csrfToken } });
      window.location = logoutResult.data.redirectUrl
    } catch (error) {
      toaster.push(renderMessageBox("success", error.response.data.message), { placement: "topCenter", duration: 2000 });
    }
  }

  return (
    <Sidenav expanded={expanded}>
      <Sidenav.Body>
        <Nav activeKey="1">
          <Nav.Item eventKey="1" icon={<DashboardIcon />}>
            Home
          </Nav.Item>
          <Nav.Item
            eventKey="2"
            icon={
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="rs-sidenav-item-icon rs-icon"
              />
            }
            onClick={handleLogout}
          >
            Logout
          </Nav.Item>
        </Nav>
      </Sidenav.Body>
      <Sidenav.Toggle onToggle={(expanded) => setExpanded(expanded)} />
    </Sidenav>
  );
}
