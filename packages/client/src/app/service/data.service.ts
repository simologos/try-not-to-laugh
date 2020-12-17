import {WebSocketSubject} from 'rxjs/internal-compatibility';
import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable, of, Subject} from 'rxjs';
import {catchError, map, switchAll, tap} from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import {Socket} from 'ngx-socket-io';
import {IGame} from '../_models/IGame';
import {GameService} from './game.service';
import {IUser} from '../_models/IUser';
import {IChatMessage} from '../_models/IChatMessage';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import {IVideo} from '../_models/IVideo';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  gameId: string = '';
  currentRound = 0;
  state = 0;
  chat: IChatMessage[] = [];
  playlist: IVideo[] = [];
  players: IUser[] = [];

  gameIdSubject: Subject<string> = new Subject();
  playersSubject: Subject<IUser[]> = new Subject();
  chatSubject: Subject<IChatMessage[]> = new Subject();
  playlistSubject: Subject<IVideo[]> = new Subject();

  constructor(private socket: Socket, private gameService: GameService, private http: HttpClient) {

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
          this.state = game.state;
          this.chat = game.chat;
          this.playlist = game.playlist;
          this.players = game.players;

          gameService.joinGame(this.gameId);

          break;
        case 'ON_GAME_JOINED':
          const user: IUser = event.payload.user;
          this.players.push(user);
          this.playersSubject.next(this.players);
          this.gameIdSubject.next(event.payload.gameId);
          break;

        case 'ON_CHAT_MESSAGE_SENT':
          const chatmessage: IChatMessage = event.payload;
          this.chat.push(chatmessage);
          this.chatSubject.next(this.chat);
          break;

        case 'ON_NEXT_ROUND':
          this.currentRound = this.currentRound + 1;
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
      console.log('connect failed' + err);
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

  public loadGame(id: string): void {
    this.http.get<any>('http://localhost:8080/v1/games/' + id).subscribe(game => {
      this.players.push(...game.players);
      this.playersSubject.next(this.players);
      this.gameId = id;
      this.gameIdSubject.next(id);
      const chatmessage: IChatMessage = game.chat;
      this.chat.push(chatmessage);
      this.chatSubject.next(this.chat);
    });
  }

  public updateState(state: number): void {
    this.http.put<any>('http://localhost:8080/v1/games/' + this.gameId, state).subscribe();
  }

  public addVideo(video: IVideo): void {
    this.http.post<any>('/v1/games/' + this.gameId + '/playlist', video).subscribe();
  }

  public leaveGame(): void {

  }
}
