import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialClaimsPaymentDetailsFormComponent } from './financial-claims-payment-details-form.component';

describe('FinancialClaimsPaymentDetailsFromComponent', () => {
  let component: FinancialClaimsPaymentDetailsFormComponent;
  let fixture: ComponentFixture<FinancialClaimsPaymentDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsPaymentDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsPaymentDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
