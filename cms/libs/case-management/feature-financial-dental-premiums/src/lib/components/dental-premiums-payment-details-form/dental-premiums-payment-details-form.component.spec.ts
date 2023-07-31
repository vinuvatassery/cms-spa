import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DentalPremiumsPaymentDetailsFormComponent } from './dental-premiums-payment-details-form.component';

describe('DentalPremiumsPaymentDetailsFromComponent', () => {
  let component: DentalPremiumsPaymentDetailsFormComponent;
  let fixture: ComponentFixture<DentalPremiumsPaymentDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsPaymentDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsPaymentDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
