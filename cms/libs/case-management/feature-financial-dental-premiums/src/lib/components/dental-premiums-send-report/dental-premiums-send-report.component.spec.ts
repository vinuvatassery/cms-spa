import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsSendReportComponent } from './dental-premiums-send-report.component';

describe('DentalPremiumsSendReportComponent', () => {
  let component: DentalPremiumsSendReportComponent;
  let fixture: ComponentFixture<DentalPremiumsSendReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsSendReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsSendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
