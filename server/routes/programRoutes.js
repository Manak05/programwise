const express = require('express');
const router = express.Router();
const {
  getPrograms, getProgramById, createProgram, updateProgram,
  deactivateProgram, activateProgram, deleteProgram, comparePrograms
} = require('../controllers/programController');
const { protect, requireAdmin } = require('../middleware/auth');

// Public/browse routes (no login required to explore programs)
router.get('/compare', comparePrograms);
router.get('/', getPrograms);
router.get('/:id', getProgramById);

// Admin-only management routes
router.post('/', protect, requireAdmin, createProgram);
router.put('/:id', protect, requireAdmin, updateProgram);
router.patch('/:id/deactivate', protect, requireAdmin, deactivateProgram);
router.patch('/:id/activate', protect, requireAdmin, activateProgram);
router.delete('/:id', protect, requireAdmin, deleteProgram);

module.exports = router;
