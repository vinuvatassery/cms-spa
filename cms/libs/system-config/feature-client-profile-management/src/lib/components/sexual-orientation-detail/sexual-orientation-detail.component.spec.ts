import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SexualOrientationDetailComponent } from './sexual-orientation-detail.component';

describe('SexualOrientationDetailComponent', () => {
  let component: SexualOrientationDetailComponent;
  let fixture: ComponentFixture<SexualOrientationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SexualOrientationDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SexualOrientationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
