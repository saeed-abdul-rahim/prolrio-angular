import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import imageCompression from 'browser-image-compression';
import Thumbnail from './Thumbnail';

@Injectable()
export class MediaService {

  thumbnailType = 'image/png';

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  public promptForVideo(): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const fileInput: HTMLInputElement = this.document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'video/*';
      fileInput.setAttribute('capture', 'camera');
      fileInput.addEventListener('error', event => {
        reject(event.error);
      });
      fileInput.addEventListener('change', event => {
        resolve(fileInput.files[0]);
      });
      fileInput.click();
    });
  }

  public generateVideoThumbnail(videoFile: Blob): Promise<Thumbnail> {
    const video: HTMLVideoElement = this.document.createElement('video');
    const canvas: HTMLCanvasElement = this.document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    return new Promise<Thumbnail>((resolve, reject) => {
      canvas.addEventListener('error',  reject);
      video.addEventListener('error',  reject);
      video.addEventListener('canplay', event => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const url = canvas.toDataURL();
        canvas.toBlob(blob => resolve({ url, blob }), this.thumbnailType, 0.85);
      });
      if (videoFile.type) {
        video.setAttribute('type', videoFile.type);
      }
      video.preload = 'auto';
      video.src = window.URL.createObjectURL(videoFile);
      video.load();
    });
  }

  public async generateImageThumbnail(imageFile: Blob): Promise<Thumbnail> {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 480,
      useWebWorker: true,
    };
    const blob = await imageCompression(imageFile, options);
    const url = await imageCompression.getDataUrlFromFile(blob);
    return { url, blob };
  }

}
