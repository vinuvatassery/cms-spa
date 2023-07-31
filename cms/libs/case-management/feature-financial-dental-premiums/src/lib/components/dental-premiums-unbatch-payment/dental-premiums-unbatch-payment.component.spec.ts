import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsUnbatchPaymentComponent } from './dental-premiums-unbatch-payment.component';

describe('DentalPremiumsUnbatchPaymentComponent', () => {
  let component: DentalPremiumsUnbatchPaymentComponent;
  let fixture: ComponentFixture<DentalPremiumsUnbatchPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsUnbatchPaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsUnbatchPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
