import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAddressDeleteComponent } from './billing-address-delete.component';

describe('BillingAddressDeleteComponent', () => {
  let component: BillingAddressDeleteComponent;
  let fixture: ComponentFixture<BillingAddressDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingAddressDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingAddressDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
