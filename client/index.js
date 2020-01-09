import React, {createElement} from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import InvalidPage from './invalid-page';
import {BrowserRouter as Router} from 'react-router-dom';
// Styles
import '../public/index.css';
// Variables

window.attachApp = (params) => {
  console.log('>>>>window.attachApp()', params);
  const {
    socketAddress,
    paypalEnv,
    paypalId,
    paypalIdDummy,
    amountDeposit,
  } = params;
  let app;
  if (socketAddress) {
    app = (
      <Router>
        <App
          socketAddress={socketAddress}
          paypalEnv={paypalEnv}
          paypalId={paypalId}
          paypalIdDummy={paypalIdDummy}
          amountDeposit={Number(amountDeposit)}
        />
      </Router>
    );
  } else {
    app = <InvalidPage />;
  }

  ReactDOM.render(app, document.getElementById('root'));
};
