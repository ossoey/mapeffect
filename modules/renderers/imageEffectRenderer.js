// modules/renderers/imageEffectRenderer.js

export class ImageEffectRenderer {
  constructor(device, format) {
    this.device = device;
    this.format = format;
    this.pipeline = null;
    this.bindGroup = null;
    this.vertexBuffer = null;
  }

  async init(shaderCode, textureView, sampler) {
    const module = this.device.createShaderModule({ code: shaderCode });

    this.pipeline = this.device.createRenderPipeline({
      layout: 'auto',
        vertex: {
        module,
        entryPoint: 'vs_main',
        buffers: [{
            arrayStride: 4 * 4, // 2 floats (position) + 2 floats (uv)
            attributes: [
            { shaderLocation: 0, offset: 0, format: 'float32x2' }, // position
            { shaderLocation: 1, offset: 8, format: 'float32x2' }  // uv
            ]
        }]
        },
      fragment: {
        module,
        entryPoint: 'fs_main',
        targets: [{ format: this.format }]
      },
      primitive: { topology: 'triangle-list' }
    });

    // Fullscreen quad vertices (xy, uv)
    const quadVerts = new Float32Array([
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
      -1,  1, 0, 0,
       1, -1, 1, 1,
       1,  1, 1, 0
    ]);

    this.vertexBuffer = this.device.createBuffer({
      size: quadVerts.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    this.device.queue.writeBuffer(this.vertexBuffer, 0, quadVerts);

    this.bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: sampler },
        { binding: 1, resource: textureView }
      ]
    });
  }

  render(encoder, view) {
    const pass = encoder.beginRenderPass({
      colorAttachments: [{
        view,
        loadOp: 'clear',
        clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
        storeOp: 'store'
      }]
    });

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.draw(6);
    pass.end();
  }
}
