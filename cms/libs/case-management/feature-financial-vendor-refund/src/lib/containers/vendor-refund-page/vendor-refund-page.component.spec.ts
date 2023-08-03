import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRefundPageComponent } from './vendor-refund-page.component';

describe('VendorRefundPageComponent', () => {
  let component: VendorRefundPageComponent;
  let fixture: ComponentFixture<VendorRefundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorRefundPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorRefundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
