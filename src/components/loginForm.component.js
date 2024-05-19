import React from "react";
import { FlexboxGrid, Form, Panel } from "rsuite";

export default function LoginForm() {



  return (
    <FlexboxGrid justify="center" align="middle">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h2>Login</h2>} bordered shaded>
          <Form fluid>
            <Form.Group controlId="login">
              <Form.ControlLabel>Username or Email Address</Form.ControlLabel>
              <Form.Control name="login" />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="password" type="password" autoComplete="off" />
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
