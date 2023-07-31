import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsPreviewPaymentRequestComponent } from './medical-premiums-preview-payment-request.component';

describe('MedicalPremiumsPreviewPaymentRequestComponent', () => {
  let component: MedicalPremiumsPreviewPaymentRequestComponent;
  let fixture: ComponentFixture<MedicalPremiumsPreviewPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsPreviewPaymentRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalPremiumsPreviewPaymentRequestComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
