import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsUnbatchPaymentComponent } from './financial-premiums-unbatch-payment.component';

describe('FinancialPremiumsUnbatchPaymentComponent', () => {
  let component: FinancialPremiumsUnbatchPaymentComponent;
  let fixture: ComponentFixture<FinancialPremiumsUnbatchPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsUnbatchPaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsUnbatchPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
