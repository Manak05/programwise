const express = require('express');
const buildLookupController = require('../controllers/lookupControllerFactory');
const { protect, requireAdmin } = require('../middleware/auth');

// Builds a router for a lookup table. Reads are public (needed for
// browsing/filtering); create/update/delete are admin-only.
function buildLookupRouter(tableName, options) {
  const router = express.Router();
  const controller = buildLookupController(tableName, options);

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', protect, requireAdmin, controller.create);
  router.put('/:id', protect, requireAdmin, controller.update);
  router.delete('/:id', protect, requireAdmin, controller.remove);

  return router;
}

module.exports = buildLookupRouter;
