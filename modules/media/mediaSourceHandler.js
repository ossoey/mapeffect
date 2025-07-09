// modules/media/mediaSourceHandler.js

export class MediaSourceHandler {
  constructor() {
    this.sourceType = null;  // 'image', 'video', 'camera'
    this.mediaElement = null;
  }

  async load(type, customSrc = null) {
    this.cleanup();
    this.sourceType = type;

    const src = customSrc ?? (type === 'image'
        ? 'assets/sample.jpg'
        : type === 'video'
        ? 'assets/sample.mp4'
        : null);

    if (type === 'image') {
        this.mediaElement = await this._loadImage(src);
    } else if (type === 'video') {
        this.mediaElement = await this._loadVideo(src);
    } else if (type === 'camera') {
        this.mediaElement = await this._loadCamera();
    } else {
        throw new Error(`Unsupported media source: ${type}`);
    }
     
     console.log(`[MediaSourceHandler] Loading ${type} from`, src);

     return this.mediaElement;
   }

  _loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

 _loadVideo(src) {
   return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.src = src;

    video.oncanplay = async () => {
      try {
        await video.play(); //  THIS LINE ensures playback
        resolve(video);
      } catch (err) {
        reject(err);
      }
    };

    video.onerror = reject;
    video.load();
  });
 }


  async _loadCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.muted = true;
    await video.play();
    return video;
  }


  cleanup() {
    if (this.mediaElement && this.mediaElement.srcObject) {
      const tracks = this.mediaElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    this.mediaElement = null;
  }

  getCurrentSourceType() {
    return this.sourceType;
  }

  getElement() {
    return this.mediaElement;
  }
}
