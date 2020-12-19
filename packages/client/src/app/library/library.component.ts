import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";
import {LibraryService} from "../service/library.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.less']
})
export class LibraryComponent implements OnInit {

  @ViewChild('modal') modalTemplate: TemplateRef;

  videos$: Observable<any>;

  formGroup: FormGroup;

  constructor(
    private modalService: NgbModal,
    private libraryService: LibraryService) {
    this.formGroup = new FormGroup({
      name: new FormControl(''),
      url: new FormControl(''),
      start: new FormControl(0),
    });
  }

  ngOnInit(): void {
    this.videos$ = this.libraryService.getVideos();
  }

  public add(): void {
    this.modalService.open(this.modalTemplate);
  }

  public save(): void {
    this.libraryService.postVideo(this.formGroup.value);
    this.formGroup.reset();
  }

}
