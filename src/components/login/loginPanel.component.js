import React, { forwardRef, useRef } from "react";
import axios from "axios";
import { Form, Panel, Button, Schema } from "rsuite";
import AvatarIcon from '@rsuite/icons/legacy/Avatar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import CustomIconInput from "./customIconInput.component";

const model = Schema.Model({
  login: Schema.Types.StringType().isRequired("This field is required."),
  password: Schema.Types.StringType().isRequired("This field is required."),
});

const LoginPanel = forwardRef(({ clickRegister, formValue, onValueChange, ...remainingProps }, ref) => {
  const localFormRef = useRef(null);

  const loginUser = async () => {
    const formValid = localFormRef.current.check();
    try {
      if (formValid) {
        const loginResult = await axios.post('/login', formValue, {
          headers: { 'X-CSRF-Token': csrfToken }
        });
      }
    } catch (error) {

    }
  }

  return (
    <Panel header="Login" bordered shaded ref={ref} {...remainingProps}>
      <Form fluid formValue={formValue} onChange={onValueChange} ref={localFormRef} model={model}>
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

        <p>Not registered yet? <Button appearance="ghost" onClick={clickRegister}>Click here to register</Button></p>

        <br />

        <Button block appearance="primary" onClick={loginUser}>Login</Button>
      </Form>
    </Panel>
  )
});

export default LoginPanel;
