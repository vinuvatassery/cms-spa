import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsDeletePaymentComponent } from './dental-premiums-delete-payment.component';

describe('DentalPremiumsDeletePaymentComponent', () => {
  let component: DentalPremiumsDeletePaymentComponent;
  let fixture: ComponentFixture<DentalPremiumsDeletePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsDeletePaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsDeletePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
