import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DataService } from '../service/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { LibraryService } from '../service/library.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-round-prepare',
  templateUrl: './round-prepare.component.html',
  styleUrls: ['./round-prepare.component.less'],
})
export class RoundPrepareComponent implements OnInit {
  public url = '';

  public name = '';

  public start = 0;

  videos$: Observable<any[]> | undefined;

  @ViewChild('modal') modalTemplate: TemplateRef<any> | undefined;

  @Output()
  submitted: EventEmitter<any> = new EventEmitter();

  constructor(private dataService: DataService,
              private libraryService: LibraryService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.videos$ = this.libraryService.getVideos().pipe(
      map((res: any) => res.result.result),
    );
  }

  public submitVideo(): void {
    this.dataService.addVideo({ url: this.url, name: this.name, start: this.start }).subscribe(
      () => this.submitted.emit(true),
      (err: any) => {
        if (err.status === 202) { this.submitted.emit(true); }
      },
    );
  }

  public open(): void {
    this.modalService.open(this.modalTemplate);
  }

  public choose(data: any): void {
    this.url = data.url;
    this.name = data.name;
    this.start = 0;
  }
}
