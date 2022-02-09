import { useSession } from '@vtfk/react-msal';
import logo from './logo.svg';
import './App.css';

function App() {
  const { isAuthenticated, login, authStatus } = useSession()

  return (
    <div className="App">
      <header className="App-header">
        <div>Environment: {process.env.NODE_ENV}</div>
        <div>Is authenticated?: {isAuthenticated}</div>
        <div>Authentication status: {authStatus}</div>
        <button onClick={() => login()}>Login</button>
        {/* {
          !isAuthenticated &&
          
        } */}
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
