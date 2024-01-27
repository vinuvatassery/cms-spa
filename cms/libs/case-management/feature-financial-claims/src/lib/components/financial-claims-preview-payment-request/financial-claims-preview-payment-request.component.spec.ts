import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsPreviewPaymentRequestComponent } from './financial-claims-preview-payment-request.component';

describe('FinancialClaimsPreviewPaymentRequestComponent', () => {
  let component: FinancialClaimsPreviewPaymentRequestComponent;
  let fixture: ComponentFixture<FinancialClaimsPreviewPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsPreviewPaymentRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialClaimsPreviewPaymentRequestComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
