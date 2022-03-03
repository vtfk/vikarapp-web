import './Main.css'
import logo from '../images/vtfk-logo.svg'
// import gear from '../images/gear.svg'
import { IconButton, Button } from '@vtfk/components'
import {
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import * as auth from '../auth'

/*
  Import nested routes
*/
import Substitute from './main/substitute';
import Overview from './main/overview/'
import Admin from './admin'
import SubstituteAdmin from './admin/substitute';
import SubstituteRelationships from './admin/substituterelationships';
import Debug from './Debug'

export default function Main() {
  const location = useLocation();

  const adminRoles = ['App.Admin', 'App.Config'];
  const userRoles = auth.getValidToken()?.roles;

  let isAdmin = false;
  userRoles.forEach((userRole) => {
    if(adminRoles.includes(userRole)) {
      isAdmin = true;
      return;
    }
  })

  return (
    <main className='main-container'>
      <div className='app-container'>
        <div className='main-header'>
          <div className='main-header-item'>
            {
              location && location.pathname !== '/' &&
              <Link to="/">
                <IconButton icon="home"/>
              </Link>
            }
          </div>
          <div className='main-header-item'>
            <h1 className='main-title' style={{margin: 0, fontSize: '3rem'}}>VikarApp</h1>
          </div>
          <div className='main-header-item'> 
            {
              isAdmin && 
              <Link to="/admin">
                <Button size="small" type="secondary">Admin</Button>
              </Link>
            }
          </div>
        </div>
        <div className='main-content'>
          <Routes>
            <Route path="substitute" element={<Substitute />} />
            <Route path="/" element={<Overview />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/substitute" element={<SubstituteAdmin />} />
            <Route path="/admin/substituterelationships" element={<SubstituteRelationships />} />
            {
              process.env.NODE_ENV === 'development' &&
              <Route path="/debug" element={<Debug /> } />
            }
          </Routes>
        </div>
        <div className='main-footer'>
          <img className='main-footer-logo' alt="footer-logo" src={logo} width="100px" />
        </div>
      </div>
    </main>
  )
}