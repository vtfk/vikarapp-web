import './style.css'
import { IconButton } from "@vtfk/components";
import { useNavigate, useLocation } from "react-router-dom"
import { hasRole } from '../../auth'

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  
  let isAdmin = false;

  if(['development', 'test'].includes(process.env.NODE_ENV)) isAdmin = true;
  isAdmin = isAdmin || hasRole(['App.Admin', 'App.Config'])

  return (
    <div className="header">
      <div className='header-item header-item-1'>
        {
          location && location.pathname !== '/' &&
          <IconButton icon="home" onClick={() => navigate('/')}/>
        }
      </div>
      <div className='header-item header-item-2'>
        <h1 className='header-title' style={{margin: 0, fontSize: '3rem'}} onClick={() => navigate('/')}>VikarApp</h1>
      </div>
      <div className='header-item header-item-3'> 
        {
          isAdmin && 
          <IconButton icon="lock" onClick={() => navigate('/admin')} />
        }
      </div>
    </div>
  )
}