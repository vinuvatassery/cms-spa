import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAddressDetailsComponent } from './payment-address-details.component';

describe('PaymentAddressDetailsComponent', () => {
  let component: PaymentAddressDetailsComponent;
  let fixture: ComponentFixture<PaymentAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentAddressDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
