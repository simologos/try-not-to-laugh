import { WebSocketSubject } from 'rxjs/internal-compatibility';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject, EMPTY, Observable, of, Subject,
} from 'rxjs';
import {
  catchError, map, switchAll, tap,
} from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IGame } from '../_models/IGame';
import { GameService } from './game.service';
import { IUser } from '../_models/IUser';
import { IChatMessage } from '../_models/IChatMessage';
// @ts-ignore
import { IVideo } from '../_models/IVideo';
import { IPlayListItem } from '../_models/IPlayListItem';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  gameId: string = '';

  userId: string = '';

  currentRound = 0;

  currentRoundPlayersReady = false;

  state = 0;

  playerCount = 0;

  chat: IChatMessage[] = [];

  playlist: any[] = [];

  players: IUser[] = [];

  checkpoints: any[] = [];

  currentRoundSubject: Subject<number> = new Subject();

  gameIdSubject: Subject<string> = new Subject();

  playersSubject: Subject<IUser[]> = new Subject();

  chatSubject: Subject<IChatMessage[]> = new Subject();

  playlistSubject: Subject<any[]> = new Subject();

  constructor(private socket: Socket, private gameService: GameService, private http: HttpClient, private router: Router) {
    socket.on('connect', (data: any) => {
      console.log(data);
    });

    socket.on('event', (event: any, data: any) => {
      switch (event.type) {
        case 'ON_GAME_ADDED':
          const game: IGame = event.payload;
          this.gameId = game.id;
          this.gameIdSubject.next(this.gameId);
          this.currentRound = game.currentRound;
          this.currentRoundSubject.next(this.currentRound);
          this.state = game.state;
          this.chat = game.chat;
          this.playlist = game.playlist;
          this.players = game.players;
          this.playerCount = game.players.length;

          this.joinGame(this.gameId);

          break;
        case 'ON_GAME_JOINED':
          const { user } = event.payload;
          this.players.push(user);
          this.playerCount = this.players.length;
          this.playersSubject.next(this.players);
          this.gameIdSubject.next(event.payload.gameId);
          break;

        case 'ON_CHAT_MESSAGE_SENT':
          const chatmessage: IChatMessage = event.payload;
          this.chat.push(chatmessage);
          this.chatSubject.next(this.chat);
          break;

        case 'ON_PLAYLIST_ITEM_ADDED':
          const video = event.payload;

          if(!this.playlist) {
            this.playlist = [];
          }

          this.playlist.push(video);
          this.playlistSubject.next(this.playlist);
          break;

        case 'ON_GAME_STATE_CHANGED':
          this.state = event.payload.state;

          // game was started, redirect players to playing page
          if (this.state === 1) {
            this.router.navigate(['/game', this.gameId]);
          }
          break;

        case 'ON_NEXT_ROUND_STARTED':

          console.log(event.payload);
          this.playlist = [];
          this.playlistSubject.next(this.playlist);
          this.fetch();
          break;

        case 'ON_ERROR':
          alert(event.payload.error);
          break;

        default:
          break;
      }
      console.log(event);
      console.log(data);
    });

    socket.on('error', () => {
      console.log('Sorry, there seems to be an issue with the connection!');
    });

    socket.on('connect_error', (err: string) => {
      console.log(`connect failed${err}`);
    });

    socket.on('connection', () => {
      console.log('connected');
    });
  }

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  getMessage() {
    return this.socket
      .fromEvent('message')
      .pipe(map((data) => console.log(data)));
  }

  public loadGame(id: string, join: boolean): void {
    this.http.get<any>(`http://localhost:8080/v1/games/${id}`).subscribe((game) => {
      console.log(game);

      this.players = game.players;
      this.playersSubject.next(this.players);
      this.gameId = id;
      this.gameIdSubject.next(id);
      this.chat = game.chat;
      this.chatSubject.next(this.chat);

      this.playlist = game.playlist[this.currentRound];
      this.playlistSubject.next(this.playlist);

      // this.checkpoints = game.checkpoints.filter((c) => c.userId === this.userId);

      if (join) {
        this.joinGame(this.gameId);
      }
    },
    (err: any) => console.error(err));
  }

  public updateState(state: number): void {
    this.http.put<any>(`http://localhost:8080/v1/games/${this.gameId}`, { state }).subscribe();
  }

  public addVideo(video: IVideo): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/v1/games/${this.gameId}/playlist`, video);
  }

  public joinGame(id: string): any {
    return this.http.post<any>(`http://localhost:8080/v1/games/${id}/players`, '').subscribe();
  }

  public createGame(): void {
    this.http.post<any>('http://localhost:8080/v1/games', '').subscribe();
  }

  public fetch(): void {
    this.loadGame(this.gameId, false);
  }

  public sendChatMessage(id: string, message: IChatMessage): void {
    this.http.post<any>(`http://localhost:8080/v1/games/${this.gameId}/chats`, message).subscribe();
  }

  public nextRound() {
    this.playlist = [];
    this.playlistSubject.next([]);
  }

  public leaveGame(): void {

  }

  private clear(): void {
  }
}
