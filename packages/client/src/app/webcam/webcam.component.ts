import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.less']
})
export class WebcamComponent implements AfterViewInit {

  @ViewChild('video')
  public video: ElementRef | undefined;

  public state: string = '';

  public expressions: any = {
    faceLost: 0,
    laughDetected: 0,
  };

  public handleInitError(error: any): void {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      alert('please allow your webcam to be accessed');
    }
  }

  async ngAfterViewInit() {

    // @ts-ignore
    await faceapi.nets.tinyFaceDetector.loadFromUri('assets/models');
    // @ts-ignore
    await faceapi.nets.faceLandmark68Net.loadFromUri('assets/models');
    // @ts-ignore
    await faceapi.nets.faceRecognitionNet.loadFromUri('assets/models');
    // @ts-ignore
    await faceapi.nets.faceExpressionNet.loadFromUri('assets/models');

    const input = document.getElementsByTagName('video')[0] as HTMLVideoElement;
    this.analyze(input);
  }

  analyze(input: HTMLVideoElement) {

    const interval = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        input,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceExpressions();

      const faceLost = detections && !detections.length;
      const laughDetected = detections && detections[0] && detections[0].expressions.happy > 0.95;
      const time = new Date().getTime();

      const newExpressions = {
        ...this.expressions
      };

      if (faceLost && !this.expressions.faceLost) {
        newExpressions.faceLost = time;
      }

      if (!faceLost && this.expressions.faceLost && new Date().getTime() - this.expressions.faceLost > 3000) {
        newExpressions.faceLost = 0;
      }

      if (laughDetected && !this.expressions.laughDetected) {
        newExpressions.laughDetected = time;
      }

      if (!laughDetected && this.expressions.laughDetected && new Date().getTime() - this.expressions.laughDetected > 3000) {
        newExpressions.laughDetected = 0;
      }

      this.expressions = newExpressions;

    }, 200);


  }
}
