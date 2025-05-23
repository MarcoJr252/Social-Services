const express = require('express');
const router = express.Router();
const AidEvent = require('../models/aidEvent.model');

// Create a new aid distribution event
router.post('/', async (req, res) => {
  try {
    const newEvent = new AidEvent(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all aid distribution events
router.get('/', async (req, res) => {
  try {
    const events = await AidEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific aid distribution event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await AidEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an aid distribution event
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await AidEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an aid distribution event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await AidEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
