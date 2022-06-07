/*
  Imports
*/
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Sentry
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

// Context
import { ErrorProvider } from './components/ErrorField/ErrorContext';
import { LoadingProvider } from './components/LoadingDialog/LoadingContext';

/*
  Import routes
*/
import AuthRoute from './components/AuthRoute'
import Main from './routes/Main';
import Login from './routes/Login'
import HandleLogin from './routes/HandleLogin'
import LoginRedirect from './routes/LoginRedirect';
import Logout from './routes/Logout'

/*
  Initialize Sentry if applicable
*/
if(process.env.REACT_APP_SENTRY_DSN) {
  if(process.env.NODE_ENV !== 'production') console.log('Setting up sentry:\n' + process.env.REACT_APP_SENTRY_DSN)
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0
  })
}

/*
  App function
*/
function App() {
  return (
    <ErrorProvider>
      <LoadingProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/login' element={ <Login /> } />
              <Route path="/handlelogin" element={<HandleLogin />} />
              <Route path="/loginredirect" element={<LoginRedirect />} />
              <Route path="/logout" element={ <Logout /> } />
              <Route path="/*" element={<AuthRoute><Main /></AuthRoute>} />
            </Routes>
          </BrowserRouter>
      </LoadingProvider>
    </ErrorProvider>
  );
}

export default App;
