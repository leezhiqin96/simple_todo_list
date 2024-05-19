import React, { forwardRef, useRef, useState } from "react";
import axios from "axios";
import { Form, Panel, Button, Stack, Schema, useToaster, Message } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import EmailIcon from "@rsuite/icons/Email";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import CustomIconInput from "./customIconInput.component";

const renderMessageBox = (type, message) => {
  return (
    <Message showIcon type={type} closable>
      {message}
    </Message>
  )
}

const asyncCheckEmail = (email) => {
  return new Promise(resolve => {
    axios.get(`/users/check?email=${email}`)
      .then(response => (
        resolve(!(response.data.exists))
      ))
  });
}

const asyncCheckUserName = (userName) => {
  return new Promise(resolve => {
    axios.get(`/users/check?userName=${userName}`)
      .then(response => (
        resolve(!(response.data.exists))
      ))
  });
}

const model = Schema.Model({
  username: Schema.Types.StringType()
    .isRequired("This field is required.")
    .addAsyncRule((value) => {
      return asyncCheckUserName(value);
    }, 'Username already exists'),
  email: Schema.Types.StringType()
    .isEmail("Please enter a valid email address.")
    .isRequired('This field is required')
    .addAsyncRule((value) => {
      return asyncCheckEmail(value);
    }, 'Email address already exists'),
  password: Schema.Types.StringType().isRequired("This field is required."),
  confirmPassword: Schema.Types.StringType().equalTo("password", "Passwords does not match"),
});

const RegisterPanel = forwardRef(
  ({ clickCancel, formValue, onValueChange, ...remainingProps }, ref) => {
    const [formValid, setFormValid] = useState(false);
    const localFormRef = useRef(null);
    const toaster = useToaster(null);

    const handleFormCheck = (formError) => {
      const noErrors = Object.keys(formError).length === 0;
      const formFilled = Object.values(formValue).every(value => value !== '');

      if (noErrors && formFilled) {
        setFormValid(true)
      } else {
        setFormValid(false);
      }
    }

    const handleRegisterSubmit = async () => {
      try {
        const formValid = localFormRef.current.check();
        if (formValid) {
          const submissionResult = await axios.post('/users', formValue, {
            headers: { 'X-CSRF-Token': csrfToken }
          })

          toaster.push(renderMessageBox("success", submissionResult.data.message), { placement: "topCenter", duration: 5000 });
        }
      } catch (error) {
        toaster.push(renderMessageBox("error", error.response.data.message), { placement: "topCenter", duration: 5000 });
      }
    }

    return (
      <Panel
        header="Register"
        bordered
        shaded
        ref={ref}
        {...remainingProps}
      >
        <Form
          fluid
          model={model}
          formValue={formValue}
          onChange={onValueChange}
          ref={localFormRef}
          onCheck={handleFormCheck}
        >
          <Form.Group controlId="email">
            <Form.Control
              name="email"
              accepter={CustomIconInput}
              icon={<EmailIcon />}
              placeholder="Email"
              type="email"
              autoComplete="email"
              checkAsync
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Control
              name="username"
              accepter={CustomIconInput}
              icon={<AvatarIcon />}
              placeholder="Username"
              checkAsync
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
          <Form.Group controlId="confirmPassword">
            <Form.Control
              name="confirmPassword"
              accepter={CustomIconInput}
              icon={<FontAwesomeIcon icon={faLock} />}
              placeholder="Confirm Your Password"
              type="password"
            />
          </Form.Group>

          <Stack justifyContent="space-between">
            <Button appearance="primary" color="red" onClick={clickCancel}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              color="green"
              onClick={handleRegisterSubmit}
              disabled={!formValid}
            >
              Submit
            </Button>
          </Stack>
        </Form>
      </Panel>
    );
  }
);

export default RegisterPanel;
