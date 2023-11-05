import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRefundClientClaimsListComponent } from './vendor-refund-client-claims-list.component';

describe('VendorRefundClientClaimsListComponent', () => {
  let component: VendorRefundClientClaimsListComponent;
  let fixture: ComponentFixture<VendorRefundClientClaimsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorRefundClientClaimsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorRefundClientClaimsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
