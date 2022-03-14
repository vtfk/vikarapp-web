
import './LoginPage.css'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as auth from '../auth'
import ErrorField from '../components/ErrorField';

async function login() {
  await auth.login();
}

export default function LoginPage() {
  const [error, setError] = useState(undefined)
  const useMountEffect = (fun) => useEffect(fun)
  const navigate = useNavigate();
  const { state } = useLocation();

  async function authenticate() {
    try {
      await login();
      navigate(state?.path || "/")
    } catch (err) {
      if(!error) setError(err);
    }
  }

  useMountEffect(() => {
    authenticate();
  })

  return (
    <div className="container">
      <div className="title">Du logges inn</div>
      <div className="subtitle">Hvis det ikke skjer automatisk, vennligst forsøk knappen</div>
      {/* <div>User agent {window.navigator.userAgent.toLocaleLowerCase()}</div> */}
      <button onClick={() => authenticate()}>Login</button>
      { error && <ErrorField error={error} showDetailsButton /> }
    </div>
  )
}