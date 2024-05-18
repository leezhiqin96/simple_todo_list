import React from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Form } from "rsuite";

export default function LoginForm() {
  const [searchParams] = useSearchParams();



  return (
    <Form>
      <Form.Group controlId="name-1">
        <Form.ControlLabel>Username</Form.ControlLabel>
        <Form.Control name="name" />
        <Form.HelpText>Required</Form.HelpText>
      </Form.Group>
      <Form.Group controlId="email-1">
        <Form.ControlLabel>Email</Form.ControlLabel>
        <Form.Control name="email" type="email" />
        <Form.HelpText>Required</Form.HelpText>
      </Form.Group>
      <Form.Group controlId="password-1">
        <Form.ControlLabel>Password</Form.ControlLabel>
        <Form.Control name="password" type="password" autoComplete="off" />
      </Form.Group>
    </Form>
  );
}
