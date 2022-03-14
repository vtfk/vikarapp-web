/*
  Import dependencies
*/
import { useState, useEffect } from 'react'
import * as auth from '../auth';
import ErrorField from '../components/ErrorField';
import './Login.css'

export default function Login() {
  const [error, setError] = useState(undefined);
  const useMountEffect = (fun) => useEffect(fun)
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useMountEffect(() => {
    if(!isLoggingIn) {
      setIsLoggingIn(true);
      try {
        throw new Error('Noe er feil')
        auth.login({force: true});
      } catch (err) {
        setError(err);
      }
      
    }
  })

  return (
    <div className='container'>
      <div className='title'>Logger inn</div>
      <div className='subtitle'>Du vil snart bli videresendt</div>
      { error && <ErrorField error={error} /> }
      {/* <div>User agent {window.navigator.userAgent.toLocaleLowerCase()}</div> */}
    </div>
  )
}