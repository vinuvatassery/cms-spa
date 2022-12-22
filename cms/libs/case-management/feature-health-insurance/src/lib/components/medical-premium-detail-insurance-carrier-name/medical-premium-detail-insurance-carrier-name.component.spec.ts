import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumDetailInsuranceCarrierNameComponent } from './medical-premium-detail-insurance-carrier-name.component';

describe('MedicalPremiumDetailInsuranceCarrierNameComponent', () => {
  let component: MedicalPremiumDetailInsuranceCarrierNameComponent;
  let fixture: ComponentFixture<MedicalPremiumDetailInsuranceCarrierNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumDetailInsuranceCarrierNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalPremiumDetailInsuranceCarrierNameComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
