/*
  Import dependencies
*/
import { useState, useEffect } from 'react'
import * as auth from '../auth';

export default function Login() {
  const useMountEffect = (fun) => useEffect(fun)
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useMountEffect(() => {
    if(!isLoggingIn) {
      setIsLoggingIn(true);
      auth.login();
    }
  })

  return (
    <div>
      <div>Loggær inn</div>
      <div>Holder på? {isLoggingIn.toString()}</div>
    </div>
  )
}