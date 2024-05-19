import React, { forwardRef } from "react";
import { Form, Panel, Button, Input, InputGroup } from "rsuite";
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import CustomIconInput from "./customIconInput.component";

const LoginPanel = forwardRef(({ clickRegister, formValue, ...remainingProps }, ref) => {
  return (
    <Panel header="Login" bordered shaded ref={ref} {...remainingProps}>
      <Form fluid>
        <Form.Group controlId="login">
          <Form.Control
            name="login"
            accepter={CustomIconInput}
            icon={<AvatarIcon />}
            placeholder="Username or Email Address"
            autoComplete="username"
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Control
            name="password"
            accepter={CustomIconInput}
            icon={<FontAwesomeIcon icon={faLock} />}
            placeholder="Password"
            type="password"
          />
        </Form.Group>

        <p>Not registered yet? <Button appearance="primary" onClick={clickRegister}>Click here to register</Button></p>
      </Form>
    </Panel>
  )
});

export default LoginPanel;
