import { useSession } from '@vtfk/react-msal';
import * as microsoftTeams from "@microsoft/teams-js";
import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const { isAuthenticated, login, authStatus, user } = useSession()
  const [isMobile, setisMobile] = useState(window.innerWidth < 1000 ? true : false);
  const [authResponse, setAuthResponse] = useState('');
  const [firstMounted, setFirstMounted] = useState(false);

  function handleWindowSizeChange() {
    if(window.innerWidth < 1000) setisMobile(true);
    else setisMobile(false);
  }

  useEffect(() => {
    microsoftTeams.initialize(() => {console.log('Library is ready!')})

    window.addEventListener('resize', handleWindowSizeChange);
    document.onload = () => { console.log('I am ready')}
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  function teamsSucessfullLoginHandler(response) {
    console.log('Response:', response);
    setAuthResponse(response);
  }

  function handleLogin() {
    if(window.navigator.userAgent.toLowerCase().includes('teams')) {
      console.log('Authenticating using teams')
      microsoftTeams.authentication.authenticate({
        url: window.location.origin,
        width: 600,
        height: 535,
        successCallback: teamsSucessfullLoginHandler
      })
    } else {
      if(isMobile) login({ scopes: ['openid', 'profile', 'User.Read'], forceRefresh: true})
      else login({ scopes: ['openid', 'profile', 'User.Read'], forceRefresh: true}, 'loginPopup')
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Environment: {process.env.NODE_ENV}</div>
        <div>User-agent: {window.navigator.userAgent}</div>
        <div>Is mobile: {isMobile.toString()}</div>
        <div>Is authenticated?: {isAuthenticated.toString()}</div>
        <div>Authentication status: {authStatus}</div>
        <div>Authentication response:<br/>{authResponse}</div>
        {
          !isAuthenticated && <button onClick={() => handleLogin()}>Login</button>
        }
        {
          isAuthenticated && JSON.stringify(user)
        }
        

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
