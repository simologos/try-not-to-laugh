import { Component } from '@angular/core';
import {DataService} from './service/data.service';
import {catchError, map, tap} from 'rxjs/operators';
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
   window.location.href = 'http://localhost:8080/auth/logout';
  }
}
