import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasAssignmentListComponent } from './financial-pcas-assignment-list.component';

describe('FinancialPcasAssignmentListComponent', () => {
  let component: FinancialPcasAssignmentListComponent;
  let fixture: ComponentFixture<FinancialPcasAssignmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasAssignmentListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasAssignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
