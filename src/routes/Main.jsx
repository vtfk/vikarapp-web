import './Main.css'
import logo from '../images/vtfk-logo.svg'
import { IconButton} from '@vtfk/components'
import {
  Routes,
  Route,
  Link
} from "react-router-dom";

/*
  Import nested routes
*/
import Substitute from './main/substitute';
import Overview from './main/overview/'


export default function Main() {
  return (
    <main className='main-container'>
      <div className='app-container'>
        <div className='main-header'>
          <div>
            <Link to="/">
              <IconButton icon="arrowLeft"/>
            </Link>
          </div> 
          <h1 className='main-title' style={{margin: 0, fontSize: '3rem'}}>VikarApp</h1>
        </div>
        <div className='main-content'>
          <Routes>
            <Route path="substitute" element={<Substitute />} />
            <Route path="/" element={<Overview />} />
          </Routes>
        </div>
        <div className='main-footer'>
          <img className='main-footer-logo' alt="footer-logo" src={logo} width="100px" />
        </div>
      </div>
    </main>
  )
}