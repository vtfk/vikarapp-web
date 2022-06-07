import './Login.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as auth from '../auth'

export default function Logout() {
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggingOut(true);
    auth.logout();
    setIsLoggingOut(false);
  },[])

  return(
    <div className='container'>
      <div className='title'>{isLoggingOut ? 'Logger ut' : 'Du har logget ut'}</div>
      {
        !isLoggingOut && <button onClick={() => { navigate('/login')}} style={{marginTop: '2rem'}}>Logg inn</button>
      }
      <div>User agent {window.navigator.userAgent.toLocaleLowerCase()}</div>
    </div>
  )
}