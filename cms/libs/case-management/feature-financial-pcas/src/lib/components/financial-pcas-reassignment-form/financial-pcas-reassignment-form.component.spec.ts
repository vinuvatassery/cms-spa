import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasReassignmentFormComponent } from './financial-pcas-reassignment-form.component';

describe('FinancialPcasReassignmentFormComponent', () => {
  let component: FinancialPcasReassignmentFormComponent;
  let fixture: ComponentFixture<FinancialPcasReassignmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasReassignmentFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasReassignmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
