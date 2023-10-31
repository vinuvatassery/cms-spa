import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRefundPharmacyPaymentsListComponent } from './vendor-refund-pharmacy-payments-list.component';

describe('VendorRefundPharmacyPaymentsListComponent', () => {
  let component: VendorRefundPharmacyPaymentsListComponent;
  let fixture: ComponentFixture<VendorRefundPharmacyPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorRefundPharmacyPaymentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorRefundPharmacyPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
