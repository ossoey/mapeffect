export class MediaSourceHandler {
  constructor(type = 'camera', source = null) {
    this.type = type;
    this.source = source;
    this.video = null;
    this.image = null;
    this.ready = this._init();
  }

  async _init() {
    if (this.type === 'camera') {
      await this._initCamera();
    } else if (this.type === 'image') {
      await this._initImage();
    } else {
      throw new Error(`Unsupported media type: ${this.type}`);
    }
  }

  async _initCamera() {
    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.video.playsInline = true;
    this.video.muted = true;
    this.video.style.display = 'none';
    document.body.appendChild(this.video);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this.video.srcObject = stream;

    await new Promise((resolve) => {
      this.video.onloadedmetadata = () => {
        this.video.play();
        resolve();
      };
    });
  }

  async _initImage() {
    if (!this.source) throw new Error('No image source provided');

    this.image = new Image();
    this.image.src = this.source;
    this.image.style.display = 'none';
    document.body.appendChild(this.image);

    await new Promise((resolve, reject) => {
      this.image.onload = () => resolve();
      this.image.onerror = reject;
    });
  }

  getVideoElement() {
    return this.video;
  }

  getImageElement() {
    return this.image;
  }

  getVideoDimensions() {
    if (this.type === 'camera') {
      return {
        width: this.video.videoWidth,
        height: this.video.videoHeight
      };
    } else if (this.type === 'image') {
      return {
        width: this.image.naturalWidth,
        height: this.image.naturalHeight
      };
    }
    return { width: 0, height: 0 };
  }
}
