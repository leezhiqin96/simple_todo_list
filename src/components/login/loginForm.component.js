import React, { useEffect, useState } from "react";
import { FlexboxGrid, Animation } from "rsuite";
import LoginPanel from "./loginPanel.component";
import RegisterPanel from "./registerPanel.component";

const initialLoginState = {
  login: '',
  password: ''
}

const initialRegisterState = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

export default function LoginForm() {
  const [mode, setMode] = useState('login');
  const [formState, setFormState] = useState({
    login: initialLoginState,
    register: initialRegisterState
  });

  useEffect(() => {
    // Resetting form values
    setFormState((prevState) => ({
      ...prevState,
      [mode]: mode === 'login' ? initialLoginState : initialRegisterState
    }));
  }, [mode])

  const handleClickRegister = () => {
    setMode('register');
  }

  const changeLoginMode = () => {
    setMode('login');
  }

  const handleFormValueChange = (formValue) => {
    setFormState((prevState) => {
      return { ...prevState, [mode]: formValue }
    })
  }

  return (
    <FlexboxGrid justify="center" align="middle">
      <FlexboxGrid.Item colspan={12}>

        {mode === 'login' && (
          <Animation.Slide in={mode === 'login'}>
            <LoginPanel
              clickRegister={handleClickRegister}
              formValue={formState.login}
              onValueChange={handleFormValueChange}
            />
          </Animation.Slide>
        )}

        {mode === 'register' && (
          <Animation.Slide in={mode === 'register'}>
            <RegisterPanel
              backToLogin={changeLoginMode}
              formValue={formState.register}
              onValueChange={handleFormValueChange}
            />
          </Animation.Slide>
        )}

      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
