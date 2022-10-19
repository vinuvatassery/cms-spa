import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeEligibilityPeriodComponent } from './resume-eligibility-period.component';

describe('ResumeEligibilityPeriodComponent', () => {
  let component: ResumeEligibilityPeriodComponent;
  let fixture: ComponentFixture<ResumeEligibilityPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumeEligibilityPeriodComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeEligibilityPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
