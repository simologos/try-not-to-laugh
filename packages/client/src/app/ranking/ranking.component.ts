import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.less']
})
export class RankingComponent implements OnInit {

  ranking$: Observable<any[]> | undefined;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.ranking$ = this.userService.ranking();
  }

}
