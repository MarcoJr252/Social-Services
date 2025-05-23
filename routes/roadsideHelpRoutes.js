const express = require('express');
const router = express.Router();
const RoadsideHelp = require('../models/roadsideHelp.model');

// Create a new roadside help request
router.post('/', async (req, res) => {
  try {
    const newRequest = new RoadsideHelp(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all roadside help requests
router.get('/', async (req, res) => {
  try {
    const requests = await RoadsideHelp.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific roadside help request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await RoadsideHelp.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update the status of a roadside help request (e.g., mark it as "On the way")
router.put('/:id', async (req, res) => {
  try {
    const updatedRequest = await RoadsideHelp.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },  // Updating status and timestamp
      { new: true }
    );
    if (!updatedRequest) return res.status(404).json({ error: 'Request not found' });
    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Assign a volunteer to a roadside help request
// Assign a volunteer to a roadside help request and include user's phone number
router.put('/:id/assign', async (req, res) => {
  try {
    // Find the roadside help request by ID
    const updatedRequest = await RoadsideHelp.findByIdAndUpdate(
      req.params.id,
      {
        volunteerId: req.body.volunteerId,   
        status: 'On the way',                 
        updatedAt: Date.now(),                
      },
      { new: true }                           
    ).populate('userId', 'mobileNumber');   


    if (!updatedRequest) return res.status(404).json({ error: 'Request not found' });


    res.json({
      ...updatedRequest._doc,
      userPhoneNumber: updatedRequest.userId.mobileNumber,  
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Delete a roadside help request
router.delete('/:id', async (req, res) => {
  try {
    const deletedRequest = await RoadsideHelp.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ error: 'Request not found' });
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
