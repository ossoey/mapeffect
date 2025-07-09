// modules/renderers/setupWebGPU.js

export async function setupWebGPU(canvas) {
  if (!navigator.gpu) {
    throw new Error('WebGPU not supported in this browser');
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error('Failed to get GPU adapter');

  const device = await adapter.requestDevice();
  const context = canvas.getContext('webgpu');

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
    alphaMode: 'opaque'
  });

  return { device, context, format, canvas };
}