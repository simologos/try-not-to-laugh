import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import IUser from '@tntl/definition/src/user/IUser';
import IChatMessage from '@tntl/definition/src/game/IChatMessage';
import IVideo from '@tntl/definition/src/library/IVideo';
import { GameService } from './game.service';
import { LibraryService } from './library.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  gameId: string | undefined = undefined;

  userId = '';

  currentRound = 0;

  state = 0;

  playerCount = 0;

  playerRoundReady = false;

  chat: IChatMessage[] = [];

  playlist: any[] = [];

  players: IUser[] = [];

  checkpoints = new Map();

  scores = new Map();

  currentRoundSubject: Subject<number> = new Subject();

  gameIdSubject: Subject<string> = new Subject();

  playersSubject: Subject<IUser[]> = new Subject();

  chatSubject: Subject<IChatMessage[]> = new Subject();

  playlistSubject: Subject<any[]> = new Subject();

  userSubject: Subject<string> = new Subject();

  constructor(private socket: Socket, private gameService: GameService, private libraryService: LibraryService, private http: HttpClient, private router: Router) {
    socket.on('connect', (data: any) => {
      console.log(data);
    });

    socket.on('event', (event: any, data: any) => {
      switch (event.type) {
        case 'ON_GAME_ADDED':
          this.gameId = event.payload.id;
          this.players = [];
          this.joinGame(this.gameId as string);
          this.fetch();

          break;
        case 'ON_GAME_JOINED':
          this.fetch();
          break;

        case 'ON_CHAT_MESSAGE_SENT':
          const chatmessage: IChatMessage = event.payload;
          this.chat.push(chatmessage);
          this.chatSubject.next(this.chat);
          break;

        case 'ON_PLAYLIST_ITEM_ADDED':

          if (!this.playlist) {
            this.playlist = [];
          }

          this.fetch();

          break;

        case 'ON_GAME_LEFT':
          this.fetch();
          break;

        case 'ON_GAME_STATE_CHANGED':
          this.state = event.payload.state;
          this.fetch();

          // game was started, redirect players to playing page
          if (this.state === 1) {
            this.router.navigate(['/game', this.gameId]);
          }
          if (this.state === 2) {
            event.payload.users.forEach( (u: any) => {
              this.scores.set(u.id, u.score);
            });

            this.router.navigate(['/score']);
            this.fetch();
            localStorage.removeItem('currentGameId');
          }
          break;

        case 'ON_NEXT_ROUND_STARTED':

          this.currentRound += 1;
          this.currentRoundSubject.next(this.currentRound);
          this.playlist = [];
          this.playlistSubject.next(this.playlist);
          this.checkpoints.clear();
          break;

        case 'ON_VIDEO_ADDED':
          this.libraryService.getVideos();
          break;

        case 'ON_VIDEO_DELETED':
          this.libraryService.getVideos();
          break;

        case 'ON_ERROR':
          alert(event.payload.error);
          break;

        default:
          break;
      }
      console.log(event);
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

  sendMessage(msg: string): void {
    this.socket.emit('message', msg);
  }

  getMessage(): Observable<void> {
    return this.socket
      .fromEvent('message')
      .pipe(map((data) => console.log(data)));
  }

  public loadGame(id: string, join: boolean): void {
    this.http.get<any>(`/v1/games/${id}`).subscribe((game) => {
      this.players = game.users;
      this.playersSubject.next(this.players);
      this.gameId = id;
      localStorage.setItem('currentGameId', id);
      this.gameIdSubject.next(id);
      this.chat = game.chat;
      this.chatSubject.next(this.chat);
      this.currentRound = game.currentRound;
      this.playerCount = game.players.length;
      this.scores.clear();

      this.playlist = game.playlist;
      this.playlistSubject.next(this.playlist);

      if (join) {
        this.joinGame(this.gameId);
      }

      if (!this.playlist || this.playlist.length === 0) {
        return;
      }

      this.playlist.forEach((p) => {
        const filtered = p.checkpoints.filter((c: any) => c.userId === this.userId);

        if (filtered && filtered[0]) {
          this.checkpoints.set(p._id, filtered[0]);
        }
      });
    },
    (err: any) => console.error(err));
  }

  public updateState(state: number): void {
    this.http.put<any>(`/v1/games/${this.gameId}`, { state }).subscribe();
  }

  public addVideo(video: IVideo): Observable<any> {
    return this.http.post<any>(`/v1/games/${this.gameId}/playlist`, video);
  }

  public joinGame(id: string): any {
    this.whoAmI();
    this.gameId = id;
    return this.http.post<any>(`/v1/games/${id}/players`, '').subscribe();
  }

  public whoAmI(): void {
    this.http.get<any>('/v1/users/me')
      .subscribe((res: any) => {
        this.userId = res.id;
        this.userSubject.next(this.userId);
      });
  }

  public createGame(): void {
    this.http.post<any>('/v1/games', '').subscribe();
  }

  public fetch(): void {
    this.loadGame(this.gameId as string, false);
  }

  public sendChatMessage(id: string, message: IChatMessage): void {
    this.http.post<any>(`/v1/games/${this.gameId}/chats`, message).subscribe();
  }

  public checkpoint(videoId: string, data: any): Observable<any> {
    const checkpointId = this.checkpoints.get(videoId)._id;
    return this.http.put<any>(`/v1/games/${this.gameId}/playlist/${videoId}/${checkpointId}`, data);
  }

  public triggerChatHistory(): void {
    this.chatSubject.next(this.chat);
  }

  public leaveGame(): void {
    this.http.delete<any>(`/v1/games/${this.gameId}/players`).subscribe();
    localStorage.removeItem('currentGameId');
    this.init();
  }

  public init(): void {
    this.players = [];
    this.playersSubject.next(this.players);
    this.gameId = undefined;
    this.gameIdSubject.next(this.gameId);
    this.chat = [];
    this.chatSubject.next(this.chat);
    this.currentRound = 0;
    this.playerCount = 0;

    this.playlist = [];
    this.playlistSubject.next(this.playlist);

    this.checkpoints.clear();
  }

  private score(): void {
    this.playlist.forEach((p) => {
      const current = this.scores.get(p.addedBy);
      let points = current || 0;
      p.checkpoints.forEach((c: any) => {
        if (c.laughed === true) {
          points += 1;
        }
      });

      this.scores.set(p.addedBy, points);
    });
  }
}
