const express = require('express');
const router = express.Router();
const ElderlyCareEvent = require('../models/elderlyCareEvent.model');

// Create a new elderly care event
router.post('/', async (req, res) => {
  try {
    const newEvent = new ElderlyCareEvent(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all elderly care events
router.get('/', async (req, res) => {
  try {
    const events = await ElderlyCareEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific elderly care event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await ElderlyCareEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an elderly care event
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await ElderlyCareEvent.findByIdAndUpdate(
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

// Delete an elderly care event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await ElderlyCareEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
