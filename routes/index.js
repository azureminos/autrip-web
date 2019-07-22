/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';

const router = express.Router();

// GET home page
router.get('/', (req, res) => {
	const { hostname } = req;
	const { PORT, LOCAL, REACT_APP_PAYPAL_ENV, REACT_APP_PAYPAL_ID, REACT_APP_PAYPAL_ID_DUMMY, REACT_APP_PAY_DEPOSIT } = process.env;
	const socketAddress
		= LOCAL === 'true' ? `http://${hostname}:${PORT}` : `wss://${hostname}`;
	const paypalEnv = REACT_APP_PAYPAL_ENV;
	const paypalId = REACT_APP_PAYPAL_ID;
	const paypalIdDummy = REACT_APP_PAYPAL_ID_DUMMY;
	const amountDeposit = REACT_APP_PAY_DEPOSIT ? Number(REACT_APP_PAY_DEPOSIT) : 0;
	res.render('./index', { socketAddress, paypalEnv, paypalId, paypalIdDummy, amountDeposit });
});

export default router;
