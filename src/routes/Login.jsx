
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

  useMountEffect(() => {
    async function authenticate() {
      await login();
      navigate(state?.path || "/")
    }
    authenticate();
  })

  return (
    <div className="container">
      <div className="title">Du logges inn</div>
      <div className="subtitle">Hvis det ikke skjer automatisk, vennligst forsøk knappen</div>
      <button>Login</button>
    </div>
  )
}