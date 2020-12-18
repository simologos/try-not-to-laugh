import { Component, OnInit, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { DataService } from '../service/data.service';
import { GameService } from '../service/game.service';
import { WebcamComponent } from '../webcam/webcam.component';

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
    id: '',
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
    this.cam?.untrack();
    this.checkpoint(data);
  }

  checkpoint(expressions: any): void {

    const data = {
      userId: this.dataService.userId,
      state: 2,
      laughed: expressions.laughDetected === 1 || expressions.faceLost === 1 ? 1 : 0,
    }

    this.dataService.checkpoint(this.current.id, data).subscribe(
      () => this.loadNext(),
      () => this.loadNext(),
    );

  }

  loadNext(): void {
    this.index += 1;
    this.setVideoData();
    this.ytPlayer?.playVideo();
  }

  setVideoData(): any {
    const video = this.videosToPlay[this.index];

    console.log(video);

    if (!video) {
      // TODO ROUND FINISHED
      alert('round finished');
      return;
    }


    this.current = {
      id: video._id,
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
