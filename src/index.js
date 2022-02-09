import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals';
import * as microsoftTeams from '@microsoft/teams-js';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

/*
  Import routes
*/
import Login from './routes/Login';
import HandleLogin from './routes/HandleLogin'

/*
  Initialize Teams
*/
microsoftTeams.initialize();
microsoftTeams.authentication.initialize();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/handlelogin" element={<HandleLogin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
