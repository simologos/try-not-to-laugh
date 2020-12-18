import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPrepareComponent } from './round-prepare.component';

describe('RoundPrepareComponent', () => {
  let component: RoundPrepareComponent;
  let fixture: ComponentFixture<RoundPrepareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundPrepareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
