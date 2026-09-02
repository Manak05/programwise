const express = require('express');
const router = express.Router();
const { getSavedPrograms, saveProgram, unsaveProgram } = require('../controllers/savedProgramController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getSavedPrograms);
router.post('/:programId', protect, saveProgram);
router.delete('/:programId', protect, unsaveProgram);

module.exports = router;
