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
  public base = '/#/lobby/';
  public lobbylink = 'init a game first';
  public id: string = '';

  constructor(private route: ActivatedRoute, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.dataService.loadGame(this.id, true);
    });

    this.players$ = this.dataService.playersSubject;
    this.dataService.gameIdSubject.subscribe(val => {
      this.id = val;
      this.lobbylink = this.base + val;
    });
  }

  public initGame(): void {
    this.dataService.createGame();
    this.players$ = this.dataService.playersSubject;
  }

  public startEnabled(): boolean {

    if (!this.dataService.players) {
      return false;
    }

    return this.dataService.players.length >= 2 && this.dataService.players.length <= 4;
  }

  public startGame(): void {
    this.dataService.updateState(1);
  }

  public leaveGame(): void {
    this.dataService.leaveGame();
  }

}
