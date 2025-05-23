const express = require('express');
const router = express.Router();
const OrphanSupportEvent = require('../models/orphanSupportEvent.model');

// Create a new orphan support event
router.post('/', async (req, res) => {
  try {
    const newEvent = new OrphanSupportEvent(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orphan support events
router.get('/', async (req, res) => {
  try {
    const events = await OrphanSupportEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific orphan support event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await OrphanSupportEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an orphan support event
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await OrphanSupportEvent.findByIdAndUpdate(
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

// Delete an orphan support event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await OrphanSupportEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
