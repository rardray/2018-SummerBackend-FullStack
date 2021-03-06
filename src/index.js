import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import registerServiceWorker from './registerServiceWorker';
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    withRouter
  } from 'react-router-dom';

ReactDOM.render(<Router><App />
</Router>
, document.getElementById('root'));
registerServiceWorker();
