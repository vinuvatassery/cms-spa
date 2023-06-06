import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAddressDeactivateComponent } from './payment-address-deactivate.component';

describe('PaymentAddressDeactivateComponent', () => {
  let component: PaymentAddressDeactivateComponent;
  let fixture: ComponentFixture<PaymentAddressDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentAddressDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentAddressDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
