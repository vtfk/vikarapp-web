import { Button } from '@vtfk/components'
import { Link } from 'react-router-dom'
import './style.css'
import { getValidToken } from '../../auth'
import { locale, localizations } from '../../localization'

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
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer'}}>{ locale(localizations.routes.admin.manageSubstitutions) }</Button>
        </Link>
      }
      {
        isAdmin &&
        <Link to="/admin/history" className='admin-action-button'>
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer'}}>{ locale(localizations.words.history) }</Button>
        </Link>
      }
      {
        isConfig &&
        <Link to="/admin/schools" className='admin-action-button'>
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer', textDecoration: 'none'}}>{ locale(localizations.routes.admin.manageSearchPermissions) }</Button>
        </Link>
      }
      {
        isAdmin &&
        <Link to="/admin/logs" className='admin-action-button'>
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer'}}>{ locale(localizations.routes.admin.logger) }</Button>
        </Link>
      }
    </div>
  )
}