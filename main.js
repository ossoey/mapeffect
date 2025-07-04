// File: main.js

import { setupWebGPU } from './modules/setupWebGPU.js';
import { TextureRenderer } from './modules/renderers/textureRenderer.js';
import { MirrorField } from './modules/effects/mirrorField.js';
import { createTestImageSource } from './modules/media/mediaSelector.js';

let renderer;
let field;

async function main() {
  const canvas = document.getElementById('webgpu-canvas');
  const context = canvas.getContext('webgpu');
  const globals = await setupWebGPU(canvas, context);

  

  const media = await createTestImageSource('./assets/sample.jpg');
  const source = media.getElement();

  const textureRenderer = new TextureRenderer(globals, { source });
  await textureRenderer.init();

  const mirrorField = new MirrorField(globals, {
    count: 50,
    layout: 'grid'
  });

  function loop(time) {
    textureRenderer.updateSource();
    mirrorField.update(time / 1000);

    const commandEncoder = globals.device.createCommandEncoder();
    const passEncoder = textureRenderer.beginRenderPass(commandEncoder);

    mirrorField.draw(passEncoder);
    passEncoder.end();
    globals.device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  window.renderer = textureRenderer;
  window.field = mirrorField;
}

main();
