import './style.css'
import { IconButton } from "@vtfk/components";
import { useNavigate, useLocation } from "react-router-dom"
import { getValidToken } from '../../auth'

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  
  let isAdmin = false;
  const token = getValidToken();
  if(['development', 'test'].includes(process.env.NODE_ENV))
  if(!isAdmin && token?.roles && Array.isArray(token.roles)) {
    isAdmin = token.roles.some((i) => ['App.Admin', 'App.Config'].includes(i))
  }

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
          <IconButton icon="activity" onClick={() => navigate('/admin')} />
        }
      </div>
    </div>
  )
}