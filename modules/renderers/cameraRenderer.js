// File: modules/renderers/cameraRenderer.js
import shaderCode from '../../shaders/passThrough.wgsl?raw';
import { initWebGPU } from '../webGpuSetup.js';

export class CameraRenderer {
  constructor(canvas, cameraHandler) {
    this.canvas = canvas;
    this.camera = cameraHandler;
  }

  async init() {
  const { device, context, format } = await initWebGPU(this.canvas);
  this.device = device;
  this.context = context;
  this.format = format;

  // 1. Detect valid source
  const video = this.camera.getVideoElement?.();
  const image = this.camera.getImageElement?.();
  this.source = video || image;

  if (!this.source) {
    throw new Error('No media source found');
  }

  // 2. Wait for dimensions to be available
  let width = 0, height = 0;

  if (video) {
    await new Promise((resolve) => {
      if (video.readyState >= 1) resolve();
      else video.onloadedmetadata = () => resolve();
    });
    width = video.videoWidth;
    height = video.videoHeight;
  } else if (image) {
    await new Promise((resolve) => {
      if (image.complete && image.naturalWidth > 0) resolve();
      else image.onload = () => resolve();
    });
    width = image.naturalWidth;
    height = image.naturalHeight;
  }

  // 3. Set canvas resolution
  this.canvas.width = width;
  this.canvas.height = height;

  // 4. Create texture
  this.videoTexture = device.createTexture({
    size: [width, height],
    format: 'rgba8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING |
           GPUTextureUsage.COPY_DST |
           GPUTextureUsage.RENDER_ATTACHMENT
  });

  this.sampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear'
  });

  // 5. Create fullscreen quad
  const vertices = new Float32Array([
    -1, -1, 0, 1,
     1, -1, 1, 1,
    -1,  1, 0, 0,
     1,  1, 1, 0
  ]);

  this.vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true
  });
  new Float32Array(this.vertexBuffer.getMappedRange()).set(vertices);
  this.vertexBuffer.unmap();

  // 6. Load and compile shader
  const shaderModule = device.createShaderModule({ code: shaderCode });

  this.pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: shaderModule,
      entryPoint: 'vs',
      buffers: [{
        arrayStride: 4 * 4,
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x2' },
          { shaderLocation: 1, offset: 2 * 4, format: 'float32x2' }
        ]
      }]
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'fs',
      targets: [{ format }]
    },
    primitive: { topology: 'triangle-strip' }
  });

  this.bindGroupLayout = this.pipeline.getBindGroupLayout(0);
 }


 render() {
  const device = this.device;
  const context = this.context;
  const view = context.getCurrentTexture().createView();

  const width = this.source.videoWidth || this.source.naturalWidth;
  const height = this.source.videoHeight || this.source.naturalHeight;

  if (!width || !height) {
    console.warn('Skipping frame: media source not ready');
    return;
  }

  // Copy current frame into GPU texture
  device.queue.copyExternalImageToTexture(
    { source: this.source },
    { texture: this.videoTexture },
    [width, height]
  );

  // Create bind group dynamically
  const bindGroup = device.createBindGroup({
    layout: this.bindGroupLayout,
    entries: [
      { binding: 0, resource: this.sampler },
      { binding: 1, resource: this.videoTexture.createView() }
    ]
  });

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view,
      loadOp: 'clear',
      clearValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: 'store'
    }]
  });

  pass.setPipeline(this.pipeline);
  pass.setVertexBuffer(0, this.vertexBuffer);
  pass.setBindGroup(0, bindGroup);
  pass.draw(4);
  pass.end();

  device.queue.submit([encoder.finish()]);
 }


  start() {
    const loop = () => {
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
  }
}
