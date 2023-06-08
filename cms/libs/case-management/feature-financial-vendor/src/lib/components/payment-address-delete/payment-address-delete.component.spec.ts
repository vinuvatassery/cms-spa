import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAddressDeleteComponent } from './payment-address-delete.component';

describe('PaymentAddressDeleteComponent', () => {
  let component: PaymentAddressDeleteComponent;
  let fixture: ComponentFixture<PaymentAddressDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentAddressDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentAddressDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
