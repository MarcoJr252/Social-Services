const express = require('express');
const router = express.Router();
const literacyPrograms = require('../models/literacyPrograms.model');

// Create a new fixed aid distribution location
router.post('/', async (req, res) => {
  try {
    const newLocation = new literacyPrograms(req.body);
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all aid distribution locations
router.get('/', async (req, res) => {
  try {
    const locations = await literacyPrograms.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific aid distribution location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await literacyPrograms.findById(req.params.id);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an aid distribution location
router.put('/:id', async (req, res) => {
  try {
    const updatedLocation = await literacyPrograms.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLocation) return res.status(404).json({ error: 'Location not found' });
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an aid distribution location
router.delete('/:id', async (req, res) => {
  try {
    const deletedLocation = await literacyPrograms.findByIdAndDelete(req.params.id);
    if (!deletedLocation) return res.status(404).json({ error: 'Location not found' });
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
