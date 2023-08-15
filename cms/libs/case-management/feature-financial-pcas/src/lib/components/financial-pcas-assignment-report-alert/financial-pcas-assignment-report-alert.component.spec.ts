import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasAssignmentReportAlertComponent } from './financial-pcas-assignment-report-alert.component';

describe('FinancialPcasAssignmentReportAlertComponent', () => {
  let component: FinancialPcasAssignmentReportAlertComponent;
  let fixture: ComponentFixture<FinancialPcasAssignmentReportAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasAssignmentReportAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialPcasAssignmentReportAlertComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
