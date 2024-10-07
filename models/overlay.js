const mongoose = require('mongoose');

const OverlaySchema = new mongoose.Schema({
  position: { type: String, required: true },
  size: { type: String, required: true },
  content: { type: String, required: true },  // text or logo link
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('overlay', OverlaySchema);
