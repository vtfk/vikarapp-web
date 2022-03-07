import { Button } from '@vtfk/components'
import { Link } from 'react-router-dom'
import './style.css'
import { getValidToken } from '../../auth'

export default function Admin() {
  const roles = getValidToken()?.roles;
  let isAdmin = true;
  let isConfig = false;
  if(roles?.includes('App.Admin')) isAdmin = true;
  if(roles?.includes('App.Config')) isConfig = true;

  return (
    <div className='admin-container'>
      {
        isAdmin &&
        <Link to="/admin/substitute" className='admin-action-button'>
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer'}}>Behandle vikariat</Button>
        </Link>
      }
      {
        isAdmin &&
        <Link to="/admin/history" className='admin-action-button'>
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer'}}>Historikk</Button>
        </Link>
      }
      {
        isConfig &&
        <Link to="/admin/substituterelationships" className='admin-action-button'>
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer', textDecoration: 'none'}}>Behandle søkerettigheter</Button>
        </Link>
      }
    </div>
  )
}