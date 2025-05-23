const mongoose = require('mongoose');
const BloodLocation = require('../models/bloodLocation.model');

// Create a new fixed blood donation location
exports.createBloodLocation = async (req, res) => {
  try {
    const newLocation = new BloodLocation(req.body);
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all fixed blood donation locations
exports.getAllBloodLocations = async (req, res) => {
  try {
    const locations = await BloodLocation.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific fixed blood donation location by ID
exports.getBloodLocationById = async (req, res) => {
  try {
    const locationId = new mongoose.Types.ObjectId(req.params.id);  
    const location = await BloodLocation.findById(locationId);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a fixed blood donation location by ID
exports.updateBloodLocation = async (req, res) => {
  try {
    const locationId = new mongoose.Types.ObjectId(req.params.id);  
    const updatedLocation = await BloodLocation.findByIdAndUpdate(
      locationId,
      req.body,
      { new: true }
    );
    if (!updatedLocation) return res.status(404).json({ error: 'Location not found' });
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a fixed blood donation location by ID
exports.deleteBloodLocation = async (req, res) => {
  try {
    const locationId = new mongoose.Types.ObjectId(req.params.id);  
    const deletedLocation = await BloodLocation.findByIdAndDelete(locationId);
    if (!deletedLocation) return res.status(404).json({ error: 'Location not found' });
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
