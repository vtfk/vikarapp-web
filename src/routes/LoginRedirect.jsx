/*
  Import dependencies
*/
import { useState, useEffect } from 'react'
import * as auth from '../auth';
import ErrorField from '../components/ErrorField';
import { locale, localizations } from '../localization';
import './Login.css'

export default function Login() {
  const [error, setError] = useState(undefined);
  const useMountEffect = (fun) => useEffect(fun)
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useMountEffect(() => {
    if(!isLoggingIn) {
      setIsLoggingIn(true);
      try {
        auth.login({force: true});
      } catch (err) {
        setError(err);
      }
      
    }
  })

  return (
    <div className='container'>
      <div className='title'>{ locale(localizations.terms.loggingIn) }</div>
      <div className='subtitle'>{ locale(localizations.terms.youWillSoonBeRedirected) }</div>
      { error && <ErrorField error={error} /> }
    </div>
  )
}