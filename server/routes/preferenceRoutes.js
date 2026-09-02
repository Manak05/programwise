const express = require('express');
const router = express.Router();
const {
  listPreferences, getPreferenceById, createPreference,
  updatePreference, deletePreference, activatePreference
} = require('../controllers/preferenceController');
const { protect } = require('../middleware/auth');

router.get('/', protect, listPreferences);
router.get('/:id', protect, getPreferenceById);
router.post('/', protect, createPreference);
router.put('/:id', protect, updatePreference);
router.delete('/:id', protect, deletePreference);
router.patch('/:id/activate', protect, activatePreference);

module.exports = router;