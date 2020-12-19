import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import IChatMessage from '@tntl/definition/src/game/IChatMessage';
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
    this.dataService.triggerChatHistory();
    this.messages$ = this.dataService.chatSubject;
    this.dataService.gameIdSubject.subscribe(val => this.gameId = val);
  }

  public sendMessage() {

    const m: IChatMessage = {
      sender: '',
      message: this.currentMessage,
      createdAt: 0
    };

    this.dataService.sendChatMessage(this.gameId, m);
    this.currentMessage = '';
  }

}
