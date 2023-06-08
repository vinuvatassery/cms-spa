import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingEmailAddressListComponent } from './billing-email-address-list.component';

describe('BillingEmailAddressListComponent', () => {
  let component: BillingEmailAddressListComponent;
  let fixture: ComponentFixture<BillingEmailAddressListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingEmailAddressListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingEmailAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
