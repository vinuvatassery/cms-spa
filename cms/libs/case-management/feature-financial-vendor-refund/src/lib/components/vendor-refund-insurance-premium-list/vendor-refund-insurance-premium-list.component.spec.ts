import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRefundInsurancePremiumListComponent } from './vendor-refund-insurance-premium-list.component';

describe('VendorRefundInsurancePremiumListComponent', () => {
  let component: VendorRefundInsurancePremiumListComponent;
  let fixture: ComponentFixture<VendorRefundInsurancePremiumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorRefundInsurancePremiumListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      VendorRefundInsurancePremiumListComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
