// modules/ui/controlPanel.js

export class ControlPanel {
  constructor({ onSourceChange }) {
    this.onSourceChange = onSourceChange;
    this.panelElement = null;
  }

  create() {
    // Create dropdown
    const select = document.createElement('select');
    select.style.position = 'absolute';
    select.style.top = '10px';
    select.style.left = '10px';
    select.style.zIndex = '10';
    select.style.padding = '5px';

    const options = ['image', 'video', 'camera'];
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = `📁 ${opt.toUpperCase()}`;
      select.appendChild(option);
    });


    // File input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*';
    fileInput.style.position = 'absolute';
    fileInput.style.top = '50px';
    fileInput.style.left = '10px';
    fileInput.style.zIndex = '10';

    fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && this.onSourceChange) {
        const fileURL = URL.createObjectURL(file);
        const type = file.type.startsWith('video') ? 'video' : 'image';
        this.onSourceChange(type, fileURL); // modified: pass file URL
    }
    });

    document.body.appendChild(fileInput);

    const dropOverlay = document.createElement('div');
    dropOverlay.style.position = 'absolute';
    dropOverlay.style.top = 0;
    dropOverlay.style.left = 0;
    dropOverlay.style.width = '100vw';
    dropOverlay.style.height = '100vh';
    dropOverlay.style.zIndex = '1000';
    dropOverlay.style.border = '4px dashed #888';
    dropOverlay.style.background = 'rgba(0,0,0,0.6)';
    dropOverlay.style.color = '#fff';
    dropOverlay.style.display = 'none';
    dropOverlay.style.justifyContent = 'center';
    dropOverlay.style.alignItems = 'center';
    dropOverlay.style.fontSize = '24px';
    dropOverlay.innerText = 'Drop image or video file here';
    document.body.appendChild(dropOverlay);

    document.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropOverlay.style.display = 'flex';
    });

    document.addEventListener('dragleave', (e) => {
    if (e.target === dropOverlay || e.pageX === 0 || e.pageY === 0) {
        dropOverlay.style.display = 'none';
    }
    });

   document.addEventListener('drop', (e) => {
    e.preventDefault();
    dropOverlay.style.display = 'none';

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const fileURL = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? 'video' : 'image';

    console.log('[DROP] File loaded:', file.name, fileURL);

    if (this.onSourceChange) {
        this.onSourceChange(type, fileURL); // <== MUST pass the fileURL here
    }
   });

   


    // Attach handler
    select.addEventListener('change', (e) => {
      if (this.onSourceChange) {
        this.onSourceChange(e.target.value);
      }
    });

    // Add to DOM
    document.body.appendChild(select);
    this.panelElement = select;
  }

  

  getValue() {
    return this.panelElement?.value;
  }
}
