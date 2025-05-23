const express = require('express');
const router = express.Router();
const HouseRenovationEvent = require('../models/houseRenovationEvent.model');

// Create a new house renovation event
router.post('/', async (req, res) => {
  try {
    const newEvent = new HouseRenovationEvent(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all house renovation events
router.get('/', async (req, res) => {
  try {
    const events = await HouseRenovationEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific house renovation event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await HouseRenovationEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a house renovation event (e.g., change status)
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await HouseRenovationEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a house renovation event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await HouseRenovationEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
