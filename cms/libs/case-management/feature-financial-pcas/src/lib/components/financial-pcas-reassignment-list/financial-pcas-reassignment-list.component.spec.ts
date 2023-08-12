import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasReassignmentListComponent } from './financial-pcas-reassignment-list.component';

describe('FinancialPcasReassignmentListComponent', () => {
  let component: FinancialPcasReassignmentListComponent;
  let fixture: ComponentFixture<FinancialPcasReassignmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasReassignmentListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasReassignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
