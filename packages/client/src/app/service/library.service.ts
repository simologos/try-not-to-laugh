import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const BASE_URL = 'http://127.0.0.1:8080/playlist/v1';

export interface IVideo {
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class LibraryService {

  constructor(private http: HttpClient) {
  }

  public postVideo(video: IVideo): void {
    this.http.post<any>(BASE_URL, video);
  }

  public getVideos(): Observable<IVideo> {
    return this.http.get<IVideo>(BASE_URL);
  }
}
