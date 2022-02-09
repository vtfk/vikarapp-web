import { useSession } from '@vtfk/react-msal';
import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const { isAuthenticated, login, authStatus, user } = useSession()
  const [isMobile, setisMobile] = useState(window.innerWidth < 1000 ? true : false);

  function handleWindowSizeChange() {
      if(window.innerWidth < 1000) setisMobile(true);
      else setisMobile(false);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  function handleLogin() {
    if(isMobile) login({ scopes: ['openid', 'profile', 'User.Read'], forceRefresh: true})
    else login({ scopes: ['openid', 'profile', 'User.Read'], forceRefresh: true}, 'loginPopup')
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Environment: {process.env.NODE_ENV}</div>
        <div>User-agent: {window.navigator.userAgent}</div>
        <div>Is mobile: {isMobile.toString()}</div>
        <div>Is authenticated?: {isAuthenticated.toString()}</div>
        <div>Authentication status: {authStatus}</div>
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
