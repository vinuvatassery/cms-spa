import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsPreviewPaymentRequestComponent } from './dental-claims-preview-payment-request.component';

describe('DentalClaimsPreviewPaymentRequestComponent', () => {
  let component: DentalClaimsPreviewPaymentRequestComponent;
  let fixture: ComponentFixture<DentalClaimsPreviewPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsPreviewPaymentRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DentalClaimsPreviewPaymentRequestComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
