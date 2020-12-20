import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../service/data.service';
import {Observable} from 'rxjs';
import {WebcamComponent} from '../webcam/webcam.component';
import {RoundComponent} from '../round/round.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit {

  @ViewChild('round') round: RoundComponent | undefined;

  url: string;
  gameId: string;
  state: string;
  title: string;
  currentRound = 0;
  playerReady = false;
  roundReady = false;
  playlist$: Observable<any[]> | undefined;


  constructor(private route: ActivatedRoute, private dataService: DataService) {
    this.state = 'not ready';
    this.url = '';
    this.gameId = '';
    this.title = '';
    this.route.params.subscribe(params => {
      this.gameId = params.id;
    });
  }

  ngOnInit(): void {

    this.playlist$ = this.dataService.playlistSubject;

    this.dataService.currentRoundSubject.subscribe( r => {
      this.currentRound = r;
    });

    this.playlist$.subscribe(v => {

      if (v) {
        const sliced = v.slice(this.currentRound * this.dataService.playerCount);
        const filtered = sliced.filter( (vid: any) => vid.addedBy === this.dataService.userId);

        if (filtered[0]) {
          this.playerReady = true;
        } else {
          this.playerReady = false;
        }
      }

      if (v && v.length === this.dataService.playerCount * (this.currentRound + 1)) {
        this.round?.startRound();
        this.roundReady = true;
      }
      if (!v || (v && v.length === 0)) {
        this.roundReady = false;
      }
    });
  }

  public videoSubmitted($event: any): void {
    //this.playerReady = $event;
  }
}
