/*
  Import dependencies
*/
import { useState, useEffect } from 'react';
import * as auth from '../auth';
import './Login.css';

export default function HandleLogin() {
  auth.handleRedirect();

  const [error, setError] = useState();
  const [isHandeling, setIsHandeling] = useState(true)

  useEffect(() => {
    async function handle() {
      try {
        await auth.handleRedirect();
        if(auth.getValidToken()) setIsHandeling(false);
        else setError('Kunne ikke logge inn')
      } catch (err) {
        setError(err);
      }
    }
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