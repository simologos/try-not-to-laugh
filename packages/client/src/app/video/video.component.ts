import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.less']
})
export class VideoComponent implements OnInit {

  @ViewChild('player') player: any;
  videoId: string | undefined;
  playerOptions: any;

  @Input()
  set id(id: string) {
    this.videoId = id;
  }

  constructor() { }

  ngOnInit(): void {
    this.playerOptions = {
      autoplay: 1,
      controls: 0,
      autohide: 1,
      wmode: 'opaque',
      origin: window.location.host
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';


    document.body.appendChild(tag);
  }

  // Autoplay
  onReady(): void {
    console.log('in ready');
    // this.player.playVideo();
  }

  // Loop
  onStateChange(event: any): void {
    // if (event.data === 0) {
    //   this.player.playVideo();
    // }
  }
}
