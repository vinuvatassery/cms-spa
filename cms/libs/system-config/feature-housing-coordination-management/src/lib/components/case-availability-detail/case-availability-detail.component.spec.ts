import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAvailabilityDetailComponent } from './case-availability-detail.component';

describe('CaseAvailabilityDetailComponent', () => {
  let component: CaseAvailabilityDetailComponent;
  let fixture: ComponentFixture<CaseAvailabilityDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseAvailabilityDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseAvailabilityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
