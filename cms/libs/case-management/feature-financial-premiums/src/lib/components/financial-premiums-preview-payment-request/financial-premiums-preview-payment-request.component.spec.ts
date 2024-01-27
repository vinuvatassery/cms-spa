import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsPreviewPaymentRequestComponent } from './financial-premiums-preview-payment-request.component';

describe('FinancialPremiumsPreviewPaymentRequestComponent', () => {
  let component: FinancialPremiumsPreviewPaymentRequestComponent;
  let fixture: ComponentFixture<FinancialPremiumsPreviewPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsPreviewPaymentRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialPremiumsPreviewPaymentRequestComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
