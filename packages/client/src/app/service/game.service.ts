import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IChatMessage} from '../_models/IChatMessage';

const BASE_URL = 'http://localhost:8080/v1/games';

const httpOptions = {
  headers: new HttpHeaders({
  })
};


export interface IVideo {
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {

  constructor(private http: HttpClient) {
  }

  public getVideos(): Observable<IVideo> {
    return this.http.get<IVideo>(BASE_URL);
  }
}
