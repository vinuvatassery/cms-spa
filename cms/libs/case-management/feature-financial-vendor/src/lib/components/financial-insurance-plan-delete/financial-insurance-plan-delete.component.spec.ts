import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialInsurancePlanDeleteComponent } from './financial-insurance-plan-delete.component';

describe('FinancialInsurancePlanDeleteComponent', () => {
  let component: FinancialInsurancePlanDeleteComponent;
  let fixture: ComponentFixture<FinancialInsurancePlanDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialInsurancePlanDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialInsurancePlanDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
