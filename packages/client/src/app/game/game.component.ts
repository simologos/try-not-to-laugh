import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../service/data.service';
import {Observable} from 'rxjs';
import {IUser} from '../_models/IUser';

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
  }

  public upload(): void {
    this.state = 'ready';
  }
}
