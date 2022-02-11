/*
  Import dependencies
*/
import { useState, useEffect } from 'react'
import * as auth from '../auth';
import './Login.css'

export default function Login() {
  const useMountEffect = (fun) => useEffect(fun)
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useMountEffect(() => {
    if(!isLoggingIn) {
      setIsLoggingIn(true);
      auth.login({force: true});
    }
  })

  return (
    <div className='container'>
      <div className='title'>Logger inn</div>
      <div className='subtitle'>Du vil snart bli videresendt</div>
    </div>
  )
}