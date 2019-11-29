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
  const {hostname} = req;
  const {PORT, LOCAL} = process.env;
  const socketAddress =
    LOCAL === 'true' ? `http://${hostname}:${PORT}` : `wss://${hostname}`;
  res.render('./index', {
    socketAddress,
    paypalEnv: process.env.REACT_APP_PAYPAL_ENV || 'sandbox',
    paypalId: process.env.REACT_APP_PAYPAL_ID || '',
    paypalIdDummy: process.env.REACT_APP_PAYPAL_ID_DUMMY || '',
    amountDeposit: process.env.REACT_APP_PAY_DEPOSIT || '0',
  });
});

export default router;
