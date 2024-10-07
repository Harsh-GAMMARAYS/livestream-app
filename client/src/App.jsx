import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ streamId }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (videoElement) {
        playerRef.current = videojs(videoElement, {
          controls: true,
          autoplay: true,
          preload: 'auto',
          sources: [{
            src: `http://localhost:5000/hls/${streamId}/playlist.m3u8`,
            type: 'application/x-mpegURL'
          }]
        }, () => {
          console.log('player is ready');
        });

        // Add error handling
        playerRef.current.on('error', (e) => {
          console.error('Video player error:', e);
        });
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamId]);

  return (
    <div className="video-container">
      <video ref={videoRef} className="video-js" controls preload="auto" width="600" height="400" />
    </div>
  );
};

const App = () => {
  const [overlays, setOverlays] = useState([]);
  const [position, setPosition] = useState('');
  const [size, setSize] = useState('');
  const [content, setContent] = useState('');
  const [streamId, setStreamId] = useState('1');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/overlays')
      .then(response => {
        console.log('API response:', response.data); // Debugging
        if (Array.isArray(response.data)) {
          setOverlays(response.data);
        } else {
          console.error('API did not return an array:', response.data);
          setOverlays([]);
        }
      })
      .catch(error => {
        console.error('Error fetching overlays:', error);
        setError('Failed to load overlays. Please try again later.');
        setOverlays([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const addOverlay = () => {
    const newOverlay = { position, size, content };
    axios.post('/api/overlays', newOverlay)
      .then(response => {
        console.log('New overlay added:', response.data);
        setOverlays(prevOverlays => [...prevOverlays, response.data]);
      })
      .catch(error => console.error('Error adding overlay:', error));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <h1>Livestream with Overlays</h1>
      <VideoPlayer streamId={streamId} />

      <div className="overlay-controls">
        <h2>Add Overlay</h2>
        <input placeholder="Position" value={position} onChange={e => setPosition(e.target.value)} />
        <input placeholder="Size" value={size} onChange={e => setSize(e.target.value)} />
        <input placeholder="Content (Text or Logo URL)" value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={addOverlay}>Add Overlay</button>
      </div>

      <div className="overlays-list">
        <h2>Current Overlays</h2>
        {Array.isArray(overlays) && overlays.length > 0 ? (
          overlays.map((overlay, index) => (
            <div key={index} className="overlay">
              <p>Position: {overlay.position}</p>
              <p>Size: {overlay.size}</p>
              <p>Content: {overlay.content}</p>
            </div>
          ))
        ) : (
          <p>No overlays available</p>
        )}
      </div>
    </div>
  );
};

export default App;