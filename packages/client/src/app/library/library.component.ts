import {
  Component, OnInit, TemplateRef, ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryService } from '../service/library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.less'],
})
export class LibraryComponent implements OnInit {
  @ViewChild('modal') modalTemplate: TemplateRef<any> | undefined;

  videos$: Observable<any[]> | undefined;

  formGroup: FormGroup;

  constructor(
    private modalService: NgbModal,
    private libraryService: LibraryService,
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl(''),
      url: new FormControl(''),
      start: new FormControl(0),
    });
  }

  ngOnInit(): void {
    this.videos$ = this.libraryService.getVideos().pipe(
      map((res: any) => res.result.result),
    );
  }

  public add(): void {
    this.modalService.open(this.modalTemplate);
  }

  public save(): void {
    this.libraryService.postVideo(this.formGroup.value);
    this.formGroup.reset();
  }

  public remove(id: string): void {
    this.libraryService.delete(id);
  }
}
