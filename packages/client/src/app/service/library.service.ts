import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const BASE_URL = '/v1/videos';

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

  public postVideo(video: any): void {
    this.http.post<any>(BASE_URL, video).subscribe();
  }

  public getVideos(): Observable<any> {
    return this.http.get<IVideo>(BASE_URL);
  }

  public delete(id: string): void {
    this.http.delete(`${BASE_URL}/${id}`).subscribe();
  }
}
