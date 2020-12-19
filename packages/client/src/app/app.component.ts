import { Component } from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  liveData$: Observable<any> | undefined;

  constructor() {
  }

  public logout(): void {
   window.location.href = '/auth/logout';
  }
}
