const express = require('express');
const router = express.Router();
const LiteracyProgramsEvent = require('../models/literacyProgramsEvent.model');

// Create a new literacy programs event
router.post('/', async (req, res) => {
  try {
    const newEvent = new LiteracyProgramsEvent(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all literacy programs events
router.get('/', async (req, res) => {
  try {
    const events = await LiteracyProgramsEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific literacy programs event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await LiteracyProgramsEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a literacy programs event
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await LiteracyProgramsEvent.findByIdAndUpdate(
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

// Delete a literacy programs event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await LiteracyProgramsEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
