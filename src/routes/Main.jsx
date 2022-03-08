import './Main.css'
import logo from '../images/vtfk-logo.svg'
import {
  Routes,
  Route,
} from "react-router-dom";
import Header from '../components/Header/Header';

/*
  Import nested routes
*/
import Overview from './main/overview/'
import Substitute from './main/substitute';
import History from './main/history'
import Admin from './admin'
import SubstituteAdmin from './admin/substitute';
import Schools from './admin/schools';

import Debug from './Debug'

export default function Main() {
  return (
    <main className='app-container'>
      <div className='main-container'>
        <div className='main-header'>
          <Header />
        </div>
        <div className='main-content'>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/substitute" element={<Substitute />} />
            <Route path="/history" element={<History />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/substitute" element={<SubstituteAdmin />} />
            <Route path="/admin/schools" element={<Schools />} />
            <Route path="/admin/history" element={<History />} />
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