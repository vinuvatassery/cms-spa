import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmacyClaimsPaymentDetailsFormComponent } from './pharmacy-claims-payment-details-form.component';

describe('PharmacyClaimsPaymentDetailsFromComponent', () => {
  let component: PharmacyClaimsPaymentDetailsFormComponent;
  let fixture: ComponentFixture<PharmacyClaimsPaymentDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsPaymentDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsPaymentDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
