import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseEligibilityPeriodsComponent } from './case-eligibility-periods.component';

describe('CaseEligibilityPeriodsComponent', () => {
  let component: CaseEligibilityPeriodsComponent;
  let fixture: ComponentFixture<CaseEligibilityPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseEligibilityPeriodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseEligibilityPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
