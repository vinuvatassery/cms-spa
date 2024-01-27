import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsSendReportComponent } from './financial-premiums-send-report.component';

describe('FinancialPremiumsSendReportComponent', () => {
  let component: FinancialPremiumsSendReportComponent;
  let fixture: ComponentFixture<FinancialPremiumsSendReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsSendReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsSendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
