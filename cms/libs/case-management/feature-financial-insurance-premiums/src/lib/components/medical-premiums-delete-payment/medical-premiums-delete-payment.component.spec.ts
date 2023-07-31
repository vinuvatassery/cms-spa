import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsDeletePaymentComponent } from './medical-premiums-delete-payment.component';

describe('MedicalPremiumsDeletePaymentComponent', () => {
  let component: MedicalPremiumsDeletePaymentComponent;
  let fixture: ComponentFixture<MedicalPremiumsDeletePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsDeletePaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsDeletePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
