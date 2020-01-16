import React, {createElement} from 'react';
import ReactDOM from 'react-dom';
import App from './my-app';
import InvalidPage from './invalid-page';
// Variables

window.attachApp = (params) => {
  console.log('>>>>window.attachApp()', params);
  const {instId, socketAddress} = params;
  const apiUri = `https://${window.location.hostname}`;
  let app;
  if (socketAddress) {
    app = <App instId={instId} apiUri={apiUri} socketAddress={socketAddress} />;
  } else {
    app = <InvalidPage />;
  }

  ReactDOM.render(app, document.getElementById('content'));
};
