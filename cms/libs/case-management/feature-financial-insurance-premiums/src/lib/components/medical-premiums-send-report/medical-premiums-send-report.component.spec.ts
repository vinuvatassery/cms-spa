import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsSendReportComponent } from './medical-premiums-send-report.component';

describe('MedicalPremiumsSendReportComponent', () => {
  let component: MedicalPremiumsSendReportComponent;
  let fixture: ComponentFixture<MedicalPremiumsSendReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsSendReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsSendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
