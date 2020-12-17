import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public guestAuth(): void {
    window.location.href = 'http://localhost:8080/auth/anonymous';
  }

  public googleAuth(): void {
    window.location.href = 'http://localhost:8080/auth/google';
  }

}
