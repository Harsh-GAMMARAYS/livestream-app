const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// HLS conversion setup
const HLS_DIR = path.join(__dirname, 'hls');
if (!fs.existsSync(HLS_DIR)) {
  fs.mkdirSync(HLS_DIR);
}

// Store active streams
const activeStreams = new Map();

// Function to start HLS conversion
function startHLSConversion(streamId) {
  const inputUrl = process.env.RTSP_URL;
  const outputPath = path.join(HLS_DIR, `stream_${streamId}`);

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const ffmpegCommand = ffmpeg(inputUrl)
    .addInputOption('-re')
    .outputOptions([
      '-hls_time 10',
      '-hls_list_size 6',
      '-hls_flags delete_segments',
      '-f hls'
    ])
    .output(path.join(outputPath, 'playlist.m3u8'));

  ffmpegCommand.run();

  return ffmpegCommand;
}

// HLS Endpoint
app.get('/hls/:id/playlist.m3u8', (req, res) => {
  const streamId = req.params.id;
  const playlistPath = path.join(HLS_DIR, `stream_${streamId}`, 'playlist.m3u8');

  if (!activeStreams.has(streamId)) {
    const ffmpegCommand = startHLSConversion(streamId);
    activeStreams.set(streamId, ffmpegCommand);
  }

  // Wait for the playlist file to be created
  const checkPlaylist = () => {
    if (fs.existsSync(playlistPath)) {
      res.sendFile(playlistPath);
    } else {
      setTimeout(checkPlaylist, 1000); // Check again after 1 second
    }
  };

  checkPlaylist();
});

// Serve HLS segments
app.get('/hls/:id/:segment', (req, res) => {
  const { id, segment } = req.params;
  const segmentPath = path.join(HLS_DIR, `stream_${id}`, segment);

  if (fs.existsSync(segmentPath)) {
    res.sendFile(segmentPath);
  } else {
    res.status(404).send('Segment not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});