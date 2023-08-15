import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasAssignmentFormComponent } from './financial-pcas-assignment-form.component';

describe('FinancialPcasAssignmentFormComponent', () => {
  let component: FinancialPcasAssignmentFormComponent;
  let fixture: ComponentFixture<FinancialPcasAssignmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasAssignmentFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasAssignmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
