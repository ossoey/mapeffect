import { setupWebGPU } from './modules/renderers/setupWebGPU.js';
import { MediaSourceHandler } from './modules/media/mediaSourceHandler.js';
import { ControlPanel } from './modules/ui/controlPanel.js';
import { ImageEffectRenderer } from './modules/renderers/imageEffectRenderer.js';

const canvas = document.getElementById('gpu-canvas');
let device, context, format;
let texture, textureView, sampler;
let renderer;
let mediaElement;
let frameRequest;

// Load shader code
const shaderURL = './shaders/fullscreenQuad.wgsl';
const shaderCode = await (await fetch(shaderURL)).text();

async function start() {
  ({ device, context, format } = await setupWebGPU(canvas));
  sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear' });

  const mediaHandler = new MediaSourceHandler();
  const controlPanel = new ControlPanel({
   onSourceChange: async (type, fileURL = null) => {
  try {
    mediaElement = await mediaHandler.load(type, fileURL);

    if (type === 'camera' || type === 'video') {
      await new Promise((resolve) => {
        const checkReady = () => {
          if ((mediaElement.videoWidth ?? 0) > 0) {
            resolve();
          } else {
            setTimeout(checkReady, 50); // wait until width is ready
          }
        };
        checkReady();
      });
    }

    updateTextureFromMedia();
  } catch (err) {
    console.error('Media load failed:', err);
  }
 }
  });

  controlPanel.create();
}

function updateTextureFromMedia() {
  if (frameRequest) cancelAnimationFrame(frameRequest);

const width = mediaElement.videoWidth || mediaElement.naturalWidth || canvas.width;
const height = mediaElement.videoHeight || mediaElement.naturalHeight || canvas.height;

texture = device.createTexture({
  size: [width, height],
  format: 'rgba8unorm',
  usage: GPUTextureUsage.TEXTURE_BINDING |
         GPUTextureUsage.COPY_DST |
         GPUTextureUsage.RENDER_ATTACHMENT,
});

  textureView = texture.createView();

  renderer = new ImageEffectRenderer(device, format);
  renderer.init(shaderCode, textureView, sampler).then(() => {
    renderLoop();
  });
}

function renderLoop() {
  const encoder = device.createCommandEncoder();

  //  Guard: Ensure media element has size
  const width = mediaElement.videoWidth || mediaElement.naturalWidth;
  const height = mediaElement.videoHeight || mediaElement.naturalHeight;

  if (width > 0 && height > 0) {
    // Resize texture only once or if size changed (optional optimization)

    device.queue.copyExternalImageToTexture(
      { source: mediaElement },
      { texture: texture },
      [width, height]
    );
  } else {
    console.warn('🟠 Skipped frame: media not ready or has no size yet.');
  }

  const view = context.getCurrentTexture().createView();
  renderer.render(encoder, view);
  device.queue.submit([encoder.finish()]);
  frameRequest = requestAnimationFrame(renderLoop);
}

start();
