/*
  Import dependencies
*/
import { useState, useEffect } from 'react';
import * as auth from '../auth';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

export default function HandleLogin() {
  const [error, setError] = useState();
  const [isHandeling, setIsHandeling] = useState(true)
  const navigate = useNavigate();
  const { state } = useLocation();

  // Function that handles the authentication
  async function handle() {
    try {
      await auth.handleRedirect();
      if(auth.getValidToken()) {
        setIsHandeling(false);
        if (!window.opener || window.opener === window) {
          navigate(state?.path || "/");
        }
      }
      else setError('Kunne ikke logge inn')
    } catch (err) {
      setError(err);
    }
  }

  // Run on mount
  useEffect(() => {
    handle();
  }, [])

  if(error) {
    return (
      <div className='container'>
        <div>
          <div className='title'>En feil has oppstått</div>
          <div className='subtitle'>{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className='container'>
      { isHandeling && <div className='title'>Bearbeider innlogging</div> }
      { !isHandeling && 
      <div>
        <div className='title'>Innlogging vellykket</div>
        <div className='subtitle'>Du kan stenge dette vinduet nå</div>
      </div>
      }
    </div>
  )
}