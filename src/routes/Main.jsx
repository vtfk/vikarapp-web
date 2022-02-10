
import logo from '../logo.svg';
import '../App.css'
import { useState } from 'react';
import * as auth from '../auth'
import { useNavigate } from 'react-router-dom';

export default function Main() {
  // State
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isTeamsApp = userAgent.includes('microsoftteams') || userAgent.includes('teamsmobile')
  const [isMobile] = useState(userAgent.includes('android') || userAgent.includes('mobile') || false);

  // Hooks
  const navigate = useNavigate();

  return (
    <div>
      <table style={{textAlign: 'left', color: 'black', backgroundColor: '#3c4966', width: '100%'}}>
          <tbody>
            <tr>
              <th className='Table-section'>General</th>
            </tr>
            <tr>
              <th style={{width: '150px'}}>Environment</th>
              <td>{process.env.NODE_ENV}</td>
            </tr>
            <tr>
              <th>Is mobile</th>
              <td>{isMobile.toString()}</td>
            </tr>
            <tr>
              <th>Url</th>
              <td>{window.location.href}</td>
            </tr>
            <tr>
              <th>User-agent</th>
              <td>{window.navigator.userAgent}</td>
            </tr>
            <tr>
              <th className='Table-section'>Authentication</th>
            </tr>
            <tr>
              <th>Is authenticated</th>
              <td>{auth.isAuthenticated()}</td>
            </tr>
            <tr>
              <th>Logged in as</th>
              <td>{JSON.stringify(auth.getValidToken()?.token?.account?.name) || 'None'}</td>
            </tr>
            <tr>
              <th className='Table-section'>Teams</th>
            </tr>
            <tr>
              <th>Is TeamsApp</th>
              <td>{isTeamsApp.toString()}</td>
            </tr>
            <tr>
              <th className='Table-section'>Actions</th>
            </tr>
            <tr style={{columnSpan: 2}}>
              <td style={{columnSpan: 2}}>
                <div style={{textAlign: 'left', display: 'flex', gap: '0.5rem', margin: '0.5rem 0.5rem'}}>
                  <button onClick={() => {alert('Authenticated?: ' + auth.isAuthenticated() )}}>Check authentication status</button>
                  <button onClick={() => { navigate('/logout')}}>Logout</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}