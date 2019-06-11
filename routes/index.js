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
  const {DEMO, PORT, LOCAL} = process.env;
  const socketAddress = (DEMO && LOCAL) ? `http://${hostname}:${PORT}` : `wss://${hostname}`;

  res.render('./index', {socketAddress});
});

export default router;
