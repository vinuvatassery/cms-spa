import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialInsurancePlanDetailsComponent } from './financial-insurance-plan-details.component';

describe('FinancialInsurancePlanDetailsComponent', () => {
  let component: FinancialInsurancePlanDetailsComponent;
  let fixture: ComponentFixture<FinancialInsurancePlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialInsurancePlanDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialInsurancePlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
