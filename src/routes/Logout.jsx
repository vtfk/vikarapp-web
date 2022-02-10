import './Login.css'
import { useEffect, useState } from 'react'
import * as auth from '../auth'

export default function Logout() {
  const [isLoggingOut, setIsLoggingOut] = useState(true)


  useEffect(() => {
    setIsLoggingOut(true);
    auth.logout();
    setIsLoggingOut(false);
  },[])

  return(
    <div className='container'>
      <div className='title'>{isLoggingOut ? 'Logger ut' : 'Du har logget ut'}</div>
    </div>
  )
}