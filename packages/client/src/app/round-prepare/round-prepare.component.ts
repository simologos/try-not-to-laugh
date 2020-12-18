import {
  Component, EventEmitter, OnInit, Output,
} from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-round-prepare',
  templateUrl: './round-prepare.component.html',
  styleUrls: ['./round-prepare.component.less'],
})
export class RoundPrepareComponent implements OnInit {
  public url: string = '';

  public name: string = '';

  public start: number = 0;

  @Output()
  submitted: EventEmitter<any> = new EventEmitter();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  public submitVideo(): void {
    this.dataService.addVideo({ url: this.url, name: this.name, start: this.start }).subscribe(
      () => this.submitted.emit(true),
      (err: any) => { if (err.status === 202) this.submitted.emit(true); },
    );
  }
}
