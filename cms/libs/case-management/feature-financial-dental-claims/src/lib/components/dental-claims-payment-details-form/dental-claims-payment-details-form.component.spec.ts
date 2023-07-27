import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DentalClaimsPaymentDetailsFormComponent } from './dental-claims-payment-details-form.component';

describe('DentalClaimsPaymentDetailsFromComponent', () => {
  let component: DentalClaimsPaymentDetailsFormComponent;
  let fixture: ComponentFixture<DentalClaimsPaymentDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsPaymentDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsPaymentDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
