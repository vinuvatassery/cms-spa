import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAddressDeactivateComponent } from './billing-address-deactivate.component';

describe('BillingAddressDeactivateComponent', () => {
  let component: BillingAddressDeactivateComponent;
  let fixture: ComponentFixture<BillingAddressDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingAddressDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingAddressDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
