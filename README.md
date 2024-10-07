# Livestream Overlay Management System

## Overview
This project is a Livestream Overlay Management System that allows users to manage video overlays on live streams. Users can create, read, update, and delete overlays on a video stream using a React frontend and a Node.js backend with an HLS streaming integration using FFmpeg.

## Features
- View live stream video using HLS format.
- Add custom overlays (logos, text) on top of the video.
- CRUD operations for overlays using a RESTful API.
- Responsive design for various devices.

## Tech Stack
- **Frontend:** React, Video.js
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Video Processing:** FFmpeg

## Installation

### Prerequisites
- Node.js and npm
- MongoDB
- FFmpeg

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Harsh-GAMMARAYS/livestream-app.git
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/livestream
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

## API Documentation
### Base URL
```
http://localhost:5000/api
```

### Endpoints
- **GET /api/overlays**: Retrieve all overlays.
- **POST /api/overlays**: Create a new overlay.
- **PUT /api/overlays/:id**: Update an existing overlay by ID.
- **DELETE /api/overlays/:id**: Delete an overlay by ID.

## Usage
1. Input the RTSP URL for your stream on the frontend.
2. Use the overlay controls to add custom overlays.
3. View the live stream with overlays applied.

## License
This project is licensed under the MIT License.
