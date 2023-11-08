import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRefundSelectedPremiumListComponent } from './vendor-refund-selected-premium-list.component';

describe('VendorRefundSelectedPremiumListComponent', () => {
  let component: VendorRefundSelectedPremiumListComponent;
  let fixture: ComponentFixture<VendorRefundSelectedPremiumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorRefundSelectedPremiumListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      VendorRefundSelectedPremiumListComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
