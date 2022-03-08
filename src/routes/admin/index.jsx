import { Button } from '@vtfk/components'
import { Link } from 'react-router-dom'
import './style.css'
import { getValidToken } from '../../auth'

function isDev() {
  return ['development', 'test'].includes(process.env.NODE_ENV)
}

export default function Admin() {
  const roles = getValidToken()?.roles;
  let isAdmin = false;
  let isConfig = false;
  if(roles?.includes('App.Admin') || isDev()) isAdmin = true;
  if(roles?.includes('App.Config') || isDev()) isConfig = true;

  return (
    <div className='column-group'>
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
        <Link to="/admin/schools" className='admin-action-button'>
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer', textDecoration: 'none'}}>Behandle søkerettigheter</Button>
        </Link>
      }
    </div>
  )
}