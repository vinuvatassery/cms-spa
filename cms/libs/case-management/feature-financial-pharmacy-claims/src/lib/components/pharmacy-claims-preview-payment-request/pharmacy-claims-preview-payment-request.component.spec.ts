import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsPreviewPaymentRequestComponent } from './pharmacy-claims-preview-payment-request.component';

describe('PharmacyClaimsPreviewPaymentRequestComponent', () => {
  let component: PharmacyClaimsPreviewPaymentRequestComponent;
  let fixture: ComponentFixture<PharmacyClaimsPreviewPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsPreviewPaymentRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      PharmacyClaimsPreviewPaymentRequestComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
