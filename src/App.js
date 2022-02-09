import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import * as auth from './auth'

function App() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isTeamsApp = userAgent.includes('microsoftteams') || userAgent.includes('teamsmobile')

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const [isMobile, setisMobile] = useState(userAgent.includes('android') || userAgent.includes('mobile') || false);

  function handleWindowSizeChange() {
      if(window.innerWidth < 1000) setisMobile(true);
      else setisMobile(false);
  }
  useEffect(() => {
    async function authenticate() {
      if(!isAuthenticating) {
        console.log('Auth initialized');
        setIsAuthenticating(true);
        await auth.login();
        setIsAuthenticated(auth.isAuthenticated())
      }
    }
    authenticate();
    
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, [isAuthenticating]);

  return (
    <div className="App">
        <h2 style={{margin: '0 0.2rem', textAlign: 'left'}}>Status</h2>
        <table style={{textAlign: 'left', color: 'black'}}>
          <tbody>
            <tr>
              <th style={{width: '150px'}}>Environment</th>
              <td>{process.env.NODE_ENV}</td>
            </tr>
            <tr>
              <th>Is authenticated</th>
              <td>{isAuthenticated.toString()}</td>
            </tr>
            <tr>
              <th>Is TeamsApp</th>
              <td>{isTeamsApp.toString()}</td>
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
            {
              isAuthenticated &&
              <tr>
                <th>Logged in as</th>
                <td>{JSON.stringify(auth.getValidToken()?.token?.account?.name)}</td>
              </tr>
            }
          </tbody>
        </table>
        <div>
        <h2 style={{margin: '0 0.2rem', textAlign: 'left'}}>Actions</h2>
        <div style={{textAlign: 'left', display: 'flex', gap: '0.5rem', margin: '0.5rem 0.5rem'}}>
          <button onClick={() => {alert('Authenticated?: ' + isAuthenticated )}}>Check authentication status</button>
          <button onClick={() => { auth.login({ force: true })}}>Login</button>
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
