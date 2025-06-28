import { MediaSourceHandler } from './modules/mediaSourceHandler.js';
import { CameraRenderer } from './modules/renderers/cameraRenderer.js'; // You’ll need to rename it later

const canvas = document.getElementById('gpu-canvas');

// 🖼️ Load an image instead of camera
const imagePath = './assets/sample.jpg'; // Put the image in /assets/
const media = new MediaSourceHandler('image', imagePath);
await media.ready;

// Match resolution
const { width, height } = media.getVideoDimensions();
canvas.width = width;
canvas.height = height;

// Use same rendering module — you can pass either image or video
const renderer = new CameraRenderer(canvas, media);
await renderer.init();
renderer.start(); // Will need a small update
