const express = require('express');
const router = express.Router();
const bloodLocationController = require('../controllers/bloodLocationController');

// Create a new fixed blood donation location
router.post('/', bloodLocationController.createBloodLocation);

// Get all fixed blood donation locations
router.get('/', bloodLocationController.getAllBloodLocations);

// Get a specific fixed blood donation location by ID
router.get('/:id', bloodLocationController.getBloodLocationById);

// Update a fixed blood donation location by ID
router.put('/:id', bloodLocationController.updateBloodLocation);

// Delete a fixed blood donation location by ID
router.delete('/:id', bloodLocationController.deleteBloodLocation);

module.exports = router;
