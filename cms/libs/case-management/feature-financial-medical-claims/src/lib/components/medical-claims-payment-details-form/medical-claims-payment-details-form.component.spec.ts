import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsPaymentDetailsFormComponent } from './medical-claims-payment-details-form.component';

describe('MedicalClaimsPaymentDetailsFromComponent', () => {
  let component: MedicalClaimsPaymentDetailsFormComponent;
  let fixture: ComponentFixture<MedicalClaimsPaymentDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsPaymentDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsPaymentDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
