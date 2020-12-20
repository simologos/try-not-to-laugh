import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  liveData$: Observable<any> | undefined;

  loggedin = false;

  constructor(private dataService: DataService) {
  }

  public logout(): void {
    this.loggedin = false;
    this.deleteCookie('connect.sid');
    window.location.href = '/auth/logout';
  }

  ngOnInit(): void {
    const cookie = this.getCookie('connect.sid');

    this.dataService.userSubject.subscribe((next) => {
      if (next) {
        this.loggedin = true;
      } else {
        this.loggedin = false;
      }
    });

    if (cookie) {
      this.dataService.whoAmI();
    }

    const id = localStorage.getItem('currentGameId');

    if (id) {
      this.dataService.loadGame(id, false);
    }
  }

  private getCookie(name: string): any {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      // @ts-ignore
      return parts.pop().split(';').shift();
    }
  }

  private deleteCookie(name: string): void {
    const date = new Date();

    // Set it expire in -1 days
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = `${name}=; expires=${date.toUTCString()}; path=/`;
  }
}
