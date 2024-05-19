import React, { forwardRef, useRef } from "react";
import { Form, Panel, Button, Stack, Schema } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import EmailIcon from "@rsuite/icons/Email";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import CustomIconInput from "./customIconInput.component";

const model = Schema.Model({
  username: Schema.Types.StringType().isRequired("This field is required."),
  email: Schema.Types.StringType()
    .isEmail("Please enter a valid email address.")
    .isRequired('This field is required'),
  password: Schema.Types.StringType().isRequired("This field is required."),
  confirmPassword: Schema.Types.StringType().equalTo("password", "Passwords does not match"),
});

const RegisterPanel = forwardRef(
  (
    {
      clickCancel,
      formValue,
      onValueChange,
      ...remainingProps
    },
    ref
  ) => {
    const localFormRef = useRef(null);

    const handleRegisterSubmit = async () => {
      try {
        const formValid = localFormRef.current.check();
        if (formValid) {

        }
      } catch (error) {

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
        >
          <Form.Group controlId="email">
            <Form.Control
              name="email"
              accepter={CustomIconInput}
              icon={<EmailIcon />}
              placeholder="Email"
              type="email"
              autoComplete="email"
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Control
              name="username"
              accepter={CustomIconInput}
              icon={<AvatarIcon />}
              placeholder="Username"
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
            <Button appearance="primary" color="green" onClick={handleRegisterSubmit}>
              Submit
            </Button>
          </Stack>
        </Form>
      </Panel>
    );
  }
);

export default RegisterPanel;
