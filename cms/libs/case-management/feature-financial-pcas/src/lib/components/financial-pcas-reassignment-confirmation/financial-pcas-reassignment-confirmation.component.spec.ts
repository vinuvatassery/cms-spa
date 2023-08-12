import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasReassignmentConfirmationComponent } from './financial-pcas-reassignment-confirmation.component';

describe('FinancialPcasReassignmentConfirmationComponent', () => {
  let component: FinancialPcasReassignmentConfirmationComponent;
  let fixture: ComponentFixture<FinancialPcasReassignmentConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasReassignmentConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialPcasReassignmentConfirmationComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
