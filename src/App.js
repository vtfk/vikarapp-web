import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import * as auth from './auth'
import * as msTeams from '@microsoft/teams-js'

async function login() {
  await auth.login();
}

function App() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isTeamsApp = userAgent.includes('microsoftteams') || userAgent.includes('teamsmobile')

  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const [isMobile] = useState(userAgent.includes('android') || userAgent.includes('mobile') || false);

  useEffect(() => {
    async function authenticate() {
      await login();
      setIsAuthenticated(auth.isAuthenticated());
    }
    authenticate();
  }, [])

  return (
    <div className="App">
        <table style={{textAlign: 'left', color: 'black'}}>
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
              <td>{isAuthenticated.toString()}</td>
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
            {/* <tr>
              <th>Teams user</th>
              <td>
                {teamsContext || 'none'}
              </td>
            </tr> */}
          </tbody>
        </table>
        <div>
        <h2 style={{margin: '0 0.2rem', textAlign: 'left'}}>Actions</h2>
        <div style={{textAlign: 'left', display: 'flex', gap: '0.5rem', margin: '0.5rem 0.5rem'}}>
          <button onClick={() => {alert('Authenticated?: ' + auth.isAuthenticated() )}}>Check authentication status</button>
          <button onClick={async () => { await login({ force: true }); setIsAuthenticated(auth.isAuthenticated());}}>Login</button>
          <button onClick={() => { auth.logout(); setIsAuthenticated(false)}}>Logout</button>
        </div>
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
  );
}

export default App;
