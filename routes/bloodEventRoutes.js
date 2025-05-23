const express = require('express');
const router = express.Router();
const bloodEventController = require('../controllers/bloodEventController');

// Create a new blood donation event
router.post('/', bloodEventController.createBloodEvent);

// Get all blood donation events
router.get('/', bloodEventController.getAllBloodEvents);

// Get a specific blood donation event by ID
router.get('/:id', bloodEventController.getBloodEventById);

// Update a blood donation event by ID
router.put('/:id', bloodEventController.updateBloodEvent);

// Delete a blood donation event by ID
router.delete('/:id', bloodEventController.deleteBloodEvent);

module.exports = router;
