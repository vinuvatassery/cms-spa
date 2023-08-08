import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsDeletePaymentComponent } from './financial-premiums-delete-payment.component';

describe('FinancialPremiumsDeletePaymentComponent', () => {
  let component: FinancialPremiumsDeletePaymentComponent;
  let fixture: ComponentFixture<FinancialPremiumsDeletePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsDeletePaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsDeletePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
