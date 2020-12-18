import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IUser} from '../_models/IUser';
import {IChatMessage} from '../_models/IChatMessage';
import {DataService} from '../service/data.service';
import {GameService} from '../service/game.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit {

  gameId: string;
  messages$: Observable<IChatMessage[]> | undefined;
  currentMessage: string;

  constructor(private dataService: DataService) {
    this.gameId = '';
    this.currentMessage = '';
  }

  ngOnInit(): void {
    this.messages$ = this.dataService.chatSubject;
    this.dataService.gameIdSubject.subscribe(val => this.gameId = val);
  }

  public sendMessage() {

    const m: IChatMessage = {
      message: this.currentMessage,
    };

    this.dataService.sendChatMessage(this.gameId, m);
    this.currentMessage = '';
  }

}
