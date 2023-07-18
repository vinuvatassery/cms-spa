import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsPaymentDetailsFromComponent } from './medical-claims-payment-details-from.component';

describe('MedicalClaimsPaymentDetailsFromComponent', () => {
  let component: MedicalClaimsPaymentDetailsFromComponent;
  let fixture: ComponentFixture<MedicalClaimsPaymentDetailsFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsPaymentDetailsFromComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsPaymentDetailsFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
