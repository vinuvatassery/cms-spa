import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasAssignmentReportListComponent } from './financial-pcas-assignment-report-list.component';

describe('FinancialPcasAssignmentReportListComponent', () => {
  let component: FinancialPcasAssignmentReportListComponent;
  let fixture: ComponentFixture<FinancialPcasAssignmentReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasAssignmentReportListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialPcasAssignmentReportListComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
