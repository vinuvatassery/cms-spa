import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsUnbatchPaymentComponent } from './medical-premiums-unbatch-payment.component';

describe('MedicalPremiumsUnbatchPaymentComponent', () => {
  let component: MedicalPremiumsUnbatchPaymentComponent;
  let fixture: ComponentFixture<MedicalPremiumsUnbatchPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsUnbatchPaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsUnbatchPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
