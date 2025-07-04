# Project: Image Effects Engine (WebGPU)

## 🔧 Active Modules

### `modules/renderers/`

* ✅ `setupWebGPU.js` – Initializes GPU context and canvas
* ✅ `imageEffectRenderer.js` – Manages render pipeline for current effect
* 🔲 `textureRenderer.js` – (Optional) For offscreen or intermediate rendering

### `modules/media/`

* ✅ `mediaSourceHandler.js` – Handles camera/video/image source loading

### `modules/effects/`

* ✅ `mirrorFieldEffect.js` – Generates and animates all mirror fragments
* ✅ `mirrorFragment.js` – Defines individual fragment shape, UV, motion
* 🔲 `effectUtils.js` – Utilities for shapes, UVs, randomization, etc.

### `modules/ui/`

* 🔲 `controlPanel.js` – Handles UI controls (sliders, dropdowns, buttons)
* 🔲 `feedbackDisplay.js` – Displays status messages, errors, or FPS info
* 🔲 `layoutManager.js` – Optional layout, responsive behavior, toggles

### `shaders/`

* ✅ `mirrorField.wgsl` – Fragment shader for mirror effect
* 🔲 `common/mathUtils.wgsl` – Shared WGSL math routines (in progress)

### `utils/`

* 🔲 `logger.js` – Optional helper for debug output

---

## 🧪 Current Effect Pipeline

`mediaSourceHandler` → `mirrorFieldEffect` → `imageEffectRenderer` → `canvas`

---

## 🎯 TODO Queue

* [ ] Add support for switching between camera, image, and video inputs
* [ ] Add dynamic time-based animation (e.g. fragment shaking)
* [ ] Add instanced rendering for mirror fragments
* [ ] Add new effect module (e.g. `waveDisplacementEffect.js`)
* [ ] Refactor shaders for reusability and modular injection

---

## 📄 Test Files

* `index.html` → main interface
* `test/test.html` → direct module testing harness

---

## 📝 Changelog (Session Summaries)

### 2025-07-04 (Follow-up 2)

* Added `ui/` folder under `modules/` with placeholder files for interface control

### 2025-07-04

* Setup project folders and ledger
* Confirmed `sample.jpg` and `sample.mp4`
* Re-added `mirrorFragment.js`
* Reviewed and improved `project-ledger.md` formatting
* Enabled daily changelog tracking, even if no new files added

### 2025-07-03

* Sketched `mirrorFieldEffect` and `MirrorFragment` roles

---

## 🎯 Next Milestone / Design Goals

* Render mirror fragments on screen from static image
* Wire `mirrorFieldEffect` output to `imageEffectRenderer`
* Animate fragments using `time` uniform
* Add one new simple effect (e.g. wave warp)

---

## 🧠 Notes

* Keep geometry in NDC space (\[-1, 1]) for GPU projection
* Texture UV coordinates stay in \[0, 1] range
* Prefer uniform buffers for effect configuration and animation state
* Modular structure = flexible expansion later (more effects, media, shaders)
