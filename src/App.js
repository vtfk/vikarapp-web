import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import * as auth from './auth'

function App() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isTeamsApp = userAgent.includes('microsoftteams') || userAgent.includes('teamsmobile')

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isMobile, setisMobile] = useState(userAgent.includes('android') || userAgent.includes('mobile') || false);

  function handleWindowSizeChange() {
      if(window.innerWidth < 1000) setisMobile(true);
      else setisMobile(false);
  }
  useEffect(() => {
   
    if(!isAuthenticating) {
      console.log('Auth initialized');
      setIsAuthenticating(true);
      auth.login();

      // microsoftTeams.authentication.authenticate({
      //   url: `${window.location.href}login`,
      //   failureCallback: (e) => { console.log('Auth failed:', e) },
      //   successCallback: (e) => { console.log('Auth successfull:', e) }
      // })
    }
    
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, [isAuthenticating]);

  // function handleLogin() {
  //   if(isMobile) login({ scopes: ['openid', 'profile', 'User.Read'], forceRefresh: true})
  //   else login({ scopes: ['openid', 'profile', 'User.Read'], forceRefresh: true}, 'loginPopup')
  // }

  return (
    <div className="App">
        <table style={{textAlign: 'left'}}>
          <tbody>
            <tr>
              <th>Environment</th>
              <td>{process.env.NODE_ENV}</td>
            </tr>
            <tr>
              <th>Is authenticated</th>
              <td>{auth.isAuthenticated().toString()}</td>
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
          </tbody>
        </table>
        <button onClick={() => {alert('Authenticated?: ' + auth.isAuthenticated() )}}>Is AUth?</button>
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
