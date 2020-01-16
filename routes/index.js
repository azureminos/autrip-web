/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MODULES ===============================================================
import express from 'express';
import Model from '../db/schema';

const router = express.Router();

// GET home page
const handleWebviewAccess = (req, res) => {
  const {hostname} = req;
  const {PORT, LOCAL} = process.env;
  const socketAddress = LOCAL
    ? `http://${hostname}:${PORT}`
    : `wss://${hostname}`;

  const {type, id} = req.params;

  console.log('>>>>Printing input params', {type, id});

  if (type === 'home') {
    res.render('./index', {
      instId: '',
      socketAddress,
    });
  } else if (type === 'package' && id) {
    Model.getPackageById(id, (err, docs) => {
      if (err) console.error('>>>>Model.getPackageById Error', err);
      console.log('>>>>Model.getPackageById Success', docs);
      const instance = {
        packageId: id,
        totalDays: docs.totalDays,
        carOption: docs.carOption,
        isCustomised: false,
      };
      Model.createInstanceByPackageId(instance, ({err, results}) => {
        if (err) {
          console.error('>>>>Model.createInstanceByPackageId Error', {
            err,
            results,
          });
        } else {
          console.log('>>>>Model.createInstanceByPackageId Success', {
            err,
            results,
          });
          res.render('./index', {
            instId: results.instance.id,
            socketAddress,
          });
        }
      });
    });
  } else if (type === 'instance' && id) {
    res.render('./index', {
      instId: id,
      socketAddress,
    });
  } else {
    res.render('./index', {
      instId: '',
      socketAddress,
    });
  }
};

router.get('/', handleWebviewAccess);
router.get('/:type', handleWebviewAccess);
router.get('/:type/:id', handleWebviewAccess);

if (process.env.IS_CLEANUP === 'true') {
  Model.deleteAllInstanceMembers();
  Model.deleteAllInstanceItems();
  Model.deleteAllInstanceHotels();
  Model.deleteAllInstances();
}

export default router;
