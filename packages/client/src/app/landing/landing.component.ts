import { Component, OnInit, ViewChild } from '@angular/core';
import { WebcamComponent } from '../webcam/webcam.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less'],
})
export class LandingComponent implements OnInit {
  @ViewChild('cam') cam: WebcamComponent | undefined;

  constructor() { }

  ngOnInit(): void {
    if (this.cam) {
      this.cam.track();
    }
  }

  public guestAuth(): void {
    window.location.href = '/auth/anonymous';
  }

  public googleAuth(): void {
    window.location.href = '/auth/google';
  }
}
