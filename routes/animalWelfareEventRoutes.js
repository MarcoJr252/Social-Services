const express = require('express');
const router = express.Router();
const AnimalWelfareEvent = require('../models/animalWelfareEvent.model');

// Create a new animal welfare event
router.post('/', async (req, res) => {
  try {
    const newEvent = new AnimalWelfareEvent(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all animal welfare events
router.get('/', async (req, res) => {
  try {
    const events = await AnimalWelfareEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific animal welfare event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await AnimalWelfareEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an animal welfare event
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await AnimalWelfareEvent.findByIdAndUpdate(
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

// Delete an animal welfare event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await AnimalWelfareEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
