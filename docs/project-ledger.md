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

### Short-Term Goal 1: Media Sources + UI + Test Quad

* [x] Implement `mediaSourceHandler.js` to handle image, video, and camera inputs
* [x] Add dropdown in `controlPanel.js` to select input source
* [x] Allow user to load image/video from local file
* [x] Support drag-and-drop area for media files
* [ ] Display source status/messages in `feedbackDisplay.js`
* [ ] Use `layoutManager.js` for responsive layout if needed
* [x] Render selected source to a fullscreen quad (basic shader)
* [ ] Test setup in `test/test.html`

### Short-Term Goal 2: MirrorFragment + MirrorField Rendering

* [ ] Build `mirrorFragment.js` to define fragment geometry + UV

* [ ] Build `mirrorFieldEffect.js` to manage all fragments and animation

* [ ] Add helpers in `effectUtils.js` for shape/UV generation

* [ ] Create `mirrorField.wgsl` to render fragment-shaded output

* [ ] Add time-based animation (via uniform)

* [ ] Integrate into `imageEffectRenderer.js`

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

### 2025-07-07 (Follow-up 5)

* Fixed video playback issue by calling `await video.play()` in `_loadVideo()`

* Implemented `imageEffectRenderer.js` to render selected media onto a fullscreen quad

* Created WGSL shader (`fullscreenQuad.wgsl`) for simple passthrough texture display

### 2025-07-04 (Follow-up 4)

* Enabled drag-and-drop support for image/video in `controlPanel.js`
* Fixed `onSourceChange()` to correctly pass file URL to `mediaSourceHandler`

### 2025-07-04 (Follow-up 3)

* Implemented `mediaSourceHandler.js` with support for image, video, and camera inputs
* Created `controlPanel.js` with UI dropdown to switch input sources
* Wired dropdown to dynamically update and load selected media

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
