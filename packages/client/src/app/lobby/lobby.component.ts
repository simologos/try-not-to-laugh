import { Component, OnInit } from '@angular/core';
import {DataService} from '../service/data.service';
import {GameService} from '../service/game.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {IUser} from '../_models/IUser';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less']
})
export class LobbyComponent implements OnInit {

  players$: Observable<IUser[]> | undefined;
  public base = 'http://localhost:4200/lobby/';
  public lobbylink = 'init a game first';
  public id: string = '';

  constructor(private route: ActivatedRoute, private dataService: DataService, private gameService: GameService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.dataService.loadGame(this.id);
      this.gameService.joinGame(this.id);
    });

    this.players$ = this.dataService.playersSubject;
    this.dataService.gameIdSubject.subscribe(val => {
      this.id = val;
      this.lobbylink = this.base + val;
    });
  }

  public initGame(): void {
    this.gameService.createGame();
    this.players$ = this.dataService.playersSubject;

    /*this.dataService.getGameId().subscribe(v => {
      if (v === undefined) {
        return;
      }
      this.id = v;
      this.gameService.joinGame(this.id);
    });*/

  }

  public startEnabled(): boolean {
    return this.dataService.players.length >= 2 && this.dataService.players.length <= 4;
  }

  public startGame(): void {

  }

  public leaveGame(): void {
    this.dataService.leaveGame();
  }

}
