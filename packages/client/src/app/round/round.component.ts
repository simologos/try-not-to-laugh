import { Component, OnInit, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { Observable } from 'rxjs';
import { DataService } from '../service/data.service';
import { GameService } from '../service/game.service';
import { WebcamComponent } from '../webcam/webcam.component';
import { IPlayListItem } from '../_models/IPlayListItem';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.less'],
})
export class RoundComponent implements OnInit {
  @ViewChild('player') ytPlayer: YouTubePlayer | undefined;

  @ViewChild('cam') cam: WebcamComponent | undefined;

  videosToPlay: any[] = [];

  playerOptions: any;

  current = {
    url: '',
    name: '',
    start: 0,
  };

  index: number = 0;

  constructor(private dataService: DataService, private gameService: GameService) { }

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    this.playerOptions = { controls: 0, autoplay: 1, disablekb: 1 };

    this.videosToPlay = this.dataService.playlist;

    this.setVideoData();
  }

  state(event: any) {
    if (!this.ytPlayer || !this.cam) {
      return;
    }

    if (this.ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      this.cam.track();
      console.log('start laugh tracking');
    }
    if (this.ytPlayer.getPlayerState() === YT.PlayerState.ENDED) {
      this.cam.untrack();
      console.log('start laugh stopped');
      this.checkpoint({ laughDetected: 0, faceLost: 0 });
    }
  }

  onFail(data: any): void {
    this.checkpoint(data);
    console.error(data);
  }

  checkpoint(data: any): void {
    // TODO
    this.loadNext();
  }

  loadNext(): void {
    this.index += 1;
    this.setVideoData();
    this.ytPlayer?.playVideo();
  }

  setVideoData(): any {
    const video = this.videosToPlay[this.index];

    this.current = {
      name: video.name,
      url: this.getVideoId(video.url),
      start: video.start,
    };
  }

  getVideoId(url: string): string {
    let videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }

    return videoId;
  }
}
