const express = require('express');
const Overlay = require('../models/overlay');
const router = express.Router();

// Create Overlay
router.post('/', async (req, res) => {
  const { position, size, content } = req.body;
  try {
    const newOverlay = new Overlay({ position, size, content });
    await newOverlay.save();
    res.status(201).json(newOverlay);
  } catch (error) {
    res.status(500).json({ error: "Error creating overlay" });
  }
});

// Get all Overlays
router.get('/', async (req, res) => {
  try {
    const overlays = await Overlay.find();
    res.status(200).json(overlays);
  } catch (error) {
    res.status(500).json({ error: "Error fetching overlays" });
  }
});

// Update Overlay
router.put('/:id', async (req, res) => {
  const { position, size, content } = req.body;
  try {
    const updatedOverlay = await Overlay.findByIdAndUpdate(
      req.params.id,
      { position, size, content },
      { new: true }
    );
    res.status(200).json(updatedOverlay);
  } catch (error) {
    res.status(500).json({ error: "Error updating overlay" });
  }
});

// Delete Overlay
router.delete('/:id', async (req, res) => {
  try {
    await Overlay.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Overlay deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting overlay" });
  }
});

module.exports = router;
