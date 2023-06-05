import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingEmailAddressDetailsComponent } from './billing-email-address-details.component';

describe('BillingEmailAddressDetailsComponent', () => {
  let component: BillingEmailAddressDetailsComponent;
  let fixture: ComponentFixture<BillingEmailAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingEmailAddressDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingEmailAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
