import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import * as microsoftTeams from '@microsoft/teams-js';
import { BaseStyle } from '@vtfk/components'

async function main() {
  /*
    Initialization
  */
  // MSW - MockServiceWorker
  if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./mocks/browser')
    await worker.start()
  }
  // Teams client
  microsoftTeams.initialize();
  microsoftTeams.authentication.initialize();
  }

  ReactDOM.render(
    <React.StrictMode>
      <BaseStyle>
        <App />
      </BaseStyle>
    </React.StrictMode>,
  document.getElementById('root')
);

main();