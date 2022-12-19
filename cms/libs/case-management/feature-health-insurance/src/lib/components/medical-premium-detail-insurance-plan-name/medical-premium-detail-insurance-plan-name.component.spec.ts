import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumDetailInsurancePlanNameComponent } from './medical-premium-detail-insurance-plan-name.component';

describe('MedicalPremiumDetailInsurancePlanNameComponent', () => {
  let component: MedicalPremiumDetailInsurancePlanNameComponent;
  let fixture: ComponentFixture<MedicalPremiumDetailInsurancePlanNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumDetailInsurancePlanNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalPremiumDetailInsurancePlanNameComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
