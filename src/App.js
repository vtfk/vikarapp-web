import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

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
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={ <Login /> } />
        <Route exact path="/" element={<AuthRoute><Main /></AuthRoute>} />
        <Route path="/handlelogin" element={<HandleLogin />} />
        <Route path="/loginredirect" element={<LoginRedirect />} />
        <Route path="/logout" element={ <Logout /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
