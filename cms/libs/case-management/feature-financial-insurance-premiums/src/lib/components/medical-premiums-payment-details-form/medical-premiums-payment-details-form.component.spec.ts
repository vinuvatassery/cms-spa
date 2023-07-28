import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalPremiumsPaymentDetailsFormComponent } from './medical-premiums-payment-details-form.component';

describe('MedicalPremiumsPaymentDetailsFromComponent', () => {
  let component: MedicalPremiumsPaymentDetailsFormComponent;
  let fixture: ComponentFixture<MedicalPremiumsPaymentDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsPaymentDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsPaymentDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
