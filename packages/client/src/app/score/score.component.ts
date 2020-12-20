import { Component, OnInit } from '@angular/core';
import {DataService} from "../service/data.service";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.less']
})
export class ScoreComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

}
