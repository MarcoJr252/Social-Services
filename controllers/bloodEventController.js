const BloodEvent = require('../models/bloodEvent.model');

// Create a new blood donation event
exports.createBloodEvent = async (req, res) => {
  try {
    const newEvent = new BloodEvent(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all blood donation events
exports.getAllBloodEvents = async (req, res) => {
  try {
    const events = await BloodEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific blood donation event by ID
exports.getBloodEventById = async (req, res) => {
  try {
    const event = await BloodEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a blood donation event by ID
exports.updateBloodEvent = async (req, res) => {
  try {
    const updatedEvent = await BloodEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a blood donation event by ID
exports.deleteBloodEvent = async (req, res) => {
  try {
    const deletedEvent = await BloodEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
