// File: modules/effects/mirrorField.js

import { MirrorFragment } from './mirrorFragment.js';

/**
 * MirrorField manages a collection of MirrorFragments.
 * It handles layout, updates, and rendering of all fragments.
 */
export class MirrorField {
  constructor(globals = {}, options = {}) {
    const {
      count = 50,
      minRadius = 0.03,
      maxRadius = 0.08,
      layout = 'random', // support for future layouts
    } = options;

    this.device = globals.device;
    this.pipeline = globals.pipeline;
    this.bindGroupLayout = globals.bindGroupLayout;
    this.fragments = [];

    const layoutFunction = this._getLayoutFunction(layout, count);

    for (let i = 0; i < count; i++) {
      const { cx, cy } = layoutFunction(i);
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const sides = Math.floor(Math.random() * 14) + 3; // 3 to 16

      const fragment = new MirrorFragment({
        device: this.device,
        pipeline: this.pipeline,
        bindGroupLayout: this.bindGroupLayout,
      }, { cx, cy, radius, sides });

      this.fragments.push(fragment);
    }
  }

  _getLayoutFunction(layout, count) {
    if (layout === 'grid') {
      const cols = Math.ceil(Math.sqrt(count));
      return i => ({
        cx: (i % cols + 0.5) / cols,
        cy: (Math.floor(i / cols) + 0.5) / cols,
      });
    }
    // Default to random layout
    return () => ({ cx: Math.random(), cy: Math.random() });
  }

  update(time) {
    for (const fragment of this.fragments) {
      if (fragment.behavior !== 'static') {
        fragment.update(time);
      }
    }
  }

  draw(passEncoder) {
    for (const fragment of this.fragments) {
      fragment.draw(passEncoder);
    }
  }
} 
