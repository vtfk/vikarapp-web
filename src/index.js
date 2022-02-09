import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals';
import { MsalProvider } from '@vtfk/react-msal'
import { config } from './config'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

/*
  Import routes
*/
import Login from './routes/Login';

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider config={config.msal} scopes={config.msal_scopes}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
