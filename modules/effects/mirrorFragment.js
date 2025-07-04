// File: modules/effects/mirrorFragment.js

/**
 * MirrorFragment defines a single polygonal fragment for mirror effects.
 * It supports time-based mutation and GPU buffer generation.
 */
export class MirrorFragment {
  constructor(globals = {}, options = {}) {
    // GPU context
    this.device = globals.device;
    this.pipeline = globals.pipeline || null;
    this.bindGroupLayout = globals.bindGroupLayout || null;

    // Fragment configuration
    const {
      sides = 6,
      cx = 0.5,
      cy = 0.5,
      radius = 0.2,
    } = options;

    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.sides = Math.max(3, Math.min(sides, 16));

    // Animation behavior
    this.behavior = Math.random() > 0.5 ? 'pulse' : 'spin';
    this.timeOffset = Math.random() * 100;
    this.angle = 0;
    this.rotationSpeed = (Math.random() * 2 - 1) * 2 * Math.PI; // ±2π rad/s

    // Internal GPU and geometry data
    this.vertexBuffer = null;
    this.vertexCount = 0;
    this.uvs = [];
    this.positions = [];

    this.generate();
    this.createVertexBuffer();
  }

  generate(animatedRadius = this.radius, angleOffset = 0) {
    const angleStep = (2 * Math.PI) / this.sides;
    const uvs = [[this.cx, this.cy]];
    const positions = [[this.cx * 2 - 1, 1 - this.cy * 2]];

    let cosA = Math.cos(angleOffset);
    let sinA = Math.sin(angleOffset);

    for (let i = 0; i <= this.sides; i++) {
      const angle = i * angleStep;
      let dx = animatedRadius * Math.cos(angle);
      let dy = animatedRadius * Math.sin(angle);

      if (this.behavior === 'spin') {
        const rotatedX = dx * cosA - dy * sinA;
        const rotatedY = dx * sinA + dy * cosA;
        dx = rotatedX;
        dy = rotatedY;
      }

      const x = this.cx + dx;
      const y = this.cy + dy;

      uvs.push([x, y]);
      positions.push([x * 2 - 1, 1 - y * 2]);
    }

    this.uvs = this.triangulate(uvs);
    this.positions = this.triangulate(positions);
    this.vertexCount = this.positions.length;
  }

  triangulate(points) {
    const center = points[0];
    const result = [];
    for (let i = 1; i < points.length - 1; i++) {
      result.push(center, points[i], points[i + 1]);
    }
    return result;
  }

  createVertexBuffer() {
    const interleaved = [];
    for (let i = 0; i < this.positions.length; i++) {
      const [x, y] = this.positions[i];
      const [u, v] = this.uvs[i];
      interleaved.push(x, y, u, v);
    }

    const vertexData = new Float32Array(interleaved);
    this.vertexBuffer = this.device.createBuffer({
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true
    });
    new Float32Array(this.vertexBuffer.getMappedRange()).set(vertexData);
    this.vertexBuffer.unmap();
  }

  update(time) {
    let animatedRadius = this.radius;
    let angleOffset = 0;

    if (this.behavior === 'pulse') {
      animatedRadius = this.radius * (1 + 0.1 * Math.sin(time + this.timeOffset));
    } else if (this.behavior === 'spin') {
      this.angle = time * this.rotationSpeed + this.timeOffset;
      angleOffset = this.angle;
    }

    this.generate(animatedRadius, angleOffset);
    this.createVertexBuffer();
  }

  draw(passEncoder) {
    if (!this.vertexBuffer) return;
    passEncoder.setVertexBuffer(0, this.vertexBuffer);
    passEncoder.draw(this.vertexCount);
  }

  getVertexBuffer() {
    return this.vertexBuffer;
  }

  getVertexCount() {
    return this.vertexCount;
  }
}
