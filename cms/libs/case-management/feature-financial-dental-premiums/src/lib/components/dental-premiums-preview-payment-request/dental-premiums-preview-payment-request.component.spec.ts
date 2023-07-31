import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsPreviewPaymentRequestComponent } from './dental-premiums-preview-payment-request.component';

describe('DentalPremiumsPreviewPaymentRequestComponent', () => {
  let component: DentalPremiumsPreviewPaymentRequestComponent;
  let fixture: ComponentFixture<DentalPremiumsPreviewPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsPreviewPaymentRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DentalPremiumsPreviewPaymentRequestComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
