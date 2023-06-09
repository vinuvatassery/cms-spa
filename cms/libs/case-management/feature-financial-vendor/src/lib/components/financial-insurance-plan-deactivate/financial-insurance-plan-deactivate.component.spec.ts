import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialInsurancePlanDeactivateComponent } from './financial-insurance-plan-deactivate.component';

describe('FinancialInsurancePlanDeactivateComponent', () => {
  let component: FinancialInsurancePlanDeactivateComponent;
  let fixture: ComponentFixture<FinancialInsurancePlanDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialInsurancePlanDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialInsurancePlanDeactivateComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
