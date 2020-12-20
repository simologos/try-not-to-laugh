import { Component, OnInit, ViewChild } from '@angular/core';
import { WebcamComponent } from '../webcam/webcam.component';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less'],
})
export class LandingComponent implements OnInit {
  @ViewChild('cam') cam: WebcamComponent | undefined;

  loggedin = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.whoAmI();
    this.dataService.userSubject.subscribe((next) => {
      if (next) {
        this.loggedin = true;
      } else {
        this.loggedin = false;
      }
    });
  }

  public guestAuth(): void {
    window.location.href = '/auth/anonymous';
  }

  public googleAuth(): void {
    window.location.href = '/auth/google';
  }
}
