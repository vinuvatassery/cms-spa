import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRefundClaimsListComponent } from './vendor-refund-claims-list.component';

describe('VendorRefundClaimsListComponent', () => {
  let component: VendorRefundClaimsListComponent;
  let fixture: ComponentFixture<VendorRefundClaimsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorRefundClaimsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorRefundClaimsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
