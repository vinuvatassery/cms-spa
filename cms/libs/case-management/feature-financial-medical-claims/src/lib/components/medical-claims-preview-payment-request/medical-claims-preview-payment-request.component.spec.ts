import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsPreviewPaymentRequestComponent } from './medical-claims-preview-payment-request.component';

describe('MedicalClaimsPreviewPaymentRequestComponent', () => {
  let component: MedicalClaimsPreviewPaymentRequestComponent;
  let fixture: ComponentFixture<MedicalClaimsPreviewPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsPreviewPaymentRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalClaimsPreviewPaymentRequestComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
