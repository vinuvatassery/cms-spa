import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAddressListComponent } from './billing-address-list.component';

describe('BillingAddressListComponent', () => {
  let component: BillingAddressListComponent;
  let fixture: ComponentFixture<BillingAddressListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingAddressListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
