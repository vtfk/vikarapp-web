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
        <div className='admin-action-button'>
          <Link to="/admin/substitute">
            <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer'}}>Behandle vikariat</Button>
          </Link>
        </div>
      }
      {
        isConfig &&
        <div className='admin-action-button'>
        <Link to="/admin/substituterelationships">
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer', textDecoration: 'none'}}>Behandle søkerettigheter</Button>
        </Link>
      </div>
      }
    </div>
  )
}