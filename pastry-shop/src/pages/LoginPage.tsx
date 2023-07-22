import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../components/form_element/Input';
import { useForm } from '../utils/custom_hooks/form-hook';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRED,
} from '../utils/data_utils/validators';
import './LoginPage.css';
import Button from '../components/form_element/Button';
import { useHttpClient } from '../utils/custom_hooks/http-hook';
import { AuthContext } from '../utils/context/authentication-context';

const backend_url =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function LoginPage() {
  const auth = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { isLoading, sendRequest } = useHttpClient();

  const { formState, onInputChange } = useForm({
    inputs: {
      email: { value: '', isValid: false },
      password: { value: '', isValid: false },
    },
    formIsValid: false,
  });

  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage('');

    const data = {
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    };
    try {
      const response = await sendRequest(
        `${backend_url}/api/users/login`,
        'POST',
        JSON.stringify(data),
        {
          'Content-Type': 'application/json',
        }
      );

      auth.login(response.token);

      navigate('/sales');
    } catch (err) {
      setErrorMessage('Credenziali non valide');
    }
  };

  return (
    <div className="login__container">
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          onInputChange={onInputChange}
          validators={[VALIDATOR_REQUIRED, VALIDATOR_EMAIL]}
          label="Email"
          errorText="Inserire un indirizzo email valido"
        />
        <Input
          id="password"
          valueType="password"
          onInputChange={onInputChange}
          validators={[VALIDATOR_REQUIRED]}
          label="Password"
          errorText="Inserire una password"
        />
        <div className="login__label">{errorMessage}</div>
        <Button disabled={isLoading || !formState.formIsValid}>LOGIN</Button>
      </form>
    </div>
  );
}

export default LoginPage;
