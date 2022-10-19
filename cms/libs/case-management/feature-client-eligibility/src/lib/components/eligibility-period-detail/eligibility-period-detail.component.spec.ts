import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityPeriodDetailComponent } from './eligibility-period-detail.component';

describe('EligibilityPeriodDetailComponent', () => {
  let component: EligibilityPeriodDetailComponent;
  let fixture: ComponentFixture<EligibilityPeriodDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EligibilityPeriodDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityPeriodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
