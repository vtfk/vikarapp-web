import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import * as microsoftTeams from '@microsoft/teams-js';

/*
  Initialize Teams
*/
microsoftTeams.initialize();
microsoftTeams.authentication.initialize();


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
