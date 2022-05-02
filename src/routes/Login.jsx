
import './LoginPage.css'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as auth from '../auth'
import ErrorField from '../components/ErrorField';
import { locale, localizations } from '../localization';

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
      <div className="title">{ locale(localizations.routes.login.title) }</div>
      <div className="subtitle">{ locale(localizations.routes.login.subtitle) }</div>
      {/* <div>User agent {window.navigator.userAgent.toLocaleLowerCase()}</div> */}
      <button onClick={() => authenticate()}>Login</button>
      { error && <ErrorField error={error} showDetailsButton /> }
    </div>
  )
}