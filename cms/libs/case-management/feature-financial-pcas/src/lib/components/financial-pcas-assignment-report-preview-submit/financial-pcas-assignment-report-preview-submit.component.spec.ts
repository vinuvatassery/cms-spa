import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasAssignmentReportPreviewSubmitComponent } from './financial-pcas-assignment-report-preview-submit.component';

describe('FinancialPcasAssignmentReportPreviewSubmitComponent', () => {
  let component: FinancialPcasAssignmentReportPreviewSubmitComponent;
  let fixture: ComponentFixture<FinancialPcasAssignmentReportPreviewSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasAssignmentReportPreviewSubmitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialPcasAssignmentReportPreviewSubmitComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
