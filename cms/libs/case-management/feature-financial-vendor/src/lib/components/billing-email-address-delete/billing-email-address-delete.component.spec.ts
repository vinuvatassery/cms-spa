import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingEmailAddressDeleteComponent } from './billing-email-address-delete.component';

describe('BillingEmailAddressDeleteComponent', () => {
  let component: BillingEmailAddressDeleteComponent;
  let fixture: ComponentFixture<BillingEmailAddressDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingEmailAddressDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingEmailAddressDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
