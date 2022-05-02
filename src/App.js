import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
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
