import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, pipe, Subject, Subscription} from 'rxjs';
import {map} from "rxjs/operators";

const BASE_URL = '/v1/videos';

export interface IVideo {
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class LibraryService {

  videos: Subscription | undefined;

  librarySubject: Subject<any[]> = new Subject();

  constructor(private http: HttpClient) {
  }

  public postVideo(video: any): void {
    this.http.post<any>(BASE_URL, video).subscribe();
  }

  public getVideos(): void {
    this.videos = this.http.get<any[]>(BASE_URL).subscribe();
  }

  public delete(id: string): void {
    this.http.delete(`${BASE_URL}/${id}`).subscribe();
  }
}
