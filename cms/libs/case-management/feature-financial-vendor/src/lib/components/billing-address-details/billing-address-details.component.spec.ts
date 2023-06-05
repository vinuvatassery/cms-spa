import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAddressDetailsComponent } from './billing-address-details.component';

describe('BillingAddressDetailsComponent', () => {
  let component: BillingAddressDetailsComponent;
  let fixture: ComponentFixture<BillingAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingAddressDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
