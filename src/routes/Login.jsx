
import './LoginPage.css'
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as auth from '../auth'

async function login() {
  await auth.login();
}

export default function LoginPage() {
  const useMountEffect = (fun) => useEffect(fun)
  const navigate = useNavigate();
  const { state } = useLocation();

  async function authenticate() {
    await login();
    navigate(state?.path || "/")
  }

  useMountEffect(() => {
    authenticate();
  })

  return (
    <div className="container">
      <div className="title">Du logges inn</div>
      <div className="subtitle">Hvis det ikke skjer automatisk, vennligst forsøk knappen</div>
      <div>User agent {window.navigator.userAgent.toLocaleLowerCase()}</div>
      <button onClick={() => authenticate()}>Login</button>
    </div>
  )
}