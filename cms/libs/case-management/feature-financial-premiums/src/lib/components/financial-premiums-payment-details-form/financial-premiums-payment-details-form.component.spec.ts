import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialPremiumsPaymentDetailsFormComponent } from './financial-premiums-payment-details-form.component';

describe('FinancialPremiumsPaymentDetailsFromComponent', () => {
  let component: FinancialPremiumsPaymentDetailsFormComponent;
  let fixture: ComponentFixture<FinancialPremiumsPaymentDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsPaymentDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsPaymentDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
