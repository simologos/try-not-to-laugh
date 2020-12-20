import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.less'],
})
export class PlayersComponent implements OnInit {
  @Input()
  players$: Observable<any[]> | undefined;

  scores: Map<any, any> | undefined;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.scores = this.dataService.scores;
  }
}
