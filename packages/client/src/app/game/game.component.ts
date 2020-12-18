import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../service/data.service';
import {Observable} from 'rxjs';
import {IUser} from '../_models/IUser';
import {WebcamComponent} from "../webcam/webcam.component";
import {RoundComponent} from "../round/round.component";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit {

  url: string;
  gameId: string;
  state: string;
  title: string;
  currentRound: number = 0;
  playerReady: boolean = false;
  roundReady: boolean = false;
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
    // start the game
    this.dataService.updateState(1);
    this.playlist$ = this.dataService.playlistSubject;

    this.dataService.currentRoundSubject.subscribe( r => {
      this.currentRound = r;
    })

    this.playlist$.subscribe(v => {
      if (v && v.length === 2) {
        this.dataService.fetch();
        this.roundReady = true;
      }
    });
  }

  public initNextRound(): void {
    this.dataService.nextRound();
    this.roundReady = false;
  }

  public videoSubmitted($event: any) {
    this.playerReady = $event;
  }
}
