/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* ----------  External Libraries  ---------- */

import React from 'react';

/*
 * MessengerExtensions are only available on iOS and Android,
 * so show an error page if MessengerExtensions was unable to start
 */
const InvalidPage = () => {
	return (
		<div id="ivp">
			<div id="ivp-body">
				<h1>Invalid Page</h1>
				<div id="ivp-subtitle">
					<p>It looks like you're a invalid page.</p>
				</div>
			</div>
		</div>
	);
};

export default InvalidPage;
