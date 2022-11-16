import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAvailabilityListComponent } from './case-availability-list.component';

describe('CaseAvailabilityListComponent', () => {
  let component: CaseAvailabilityListComponent;
  let fixture: ComponentFixture<CaseAvailabilityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseAvailabilityListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseAvailabilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
