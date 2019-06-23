import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import '../public/index.css';
import App from './App';
import InvalidPage from './invalid-page';
import { BrowserRouter as Router } from 'react-router-dom';

window.attachApp = ({ socketAddress }) => {
	console.log('>>>>window.attachApp()', socketAddress);

	let app;
	if (socketAddress) {
		app = (
			<Router>
				<App />
			</Router>
		);
	} else {
		app = <InvalidPage />;
	}

	ReactDOM.render(app, document.getElementById('root'));
};
