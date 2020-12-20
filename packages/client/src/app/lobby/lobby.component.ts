import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import IUser from '@tntl/definition/src/user/IUser';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less'],
})
export class LobbyComponent implements OnInit {
  players$: Observable<IUser[]> | undefined;

  public base = '/#/lobby/';

  public lobbylink = 'init a game first';

  public id = '';

  constructor(private route: ActivatedRoute, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.dataService.loadGame(this.id, true);
    });

    this.players$ = this.dataService.playersSubject;
    this.dataService.gameIdSubject.subscribe((val) => {
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
