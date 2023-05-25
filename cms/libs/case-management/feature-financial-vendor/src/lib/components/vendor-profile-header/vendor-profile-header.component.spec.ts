import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProfileHeaderComponent } from './vendor-profile-header.component';

describe('VendorProfileHeaderComponent', () => {
  let component: VendorProfileHeaderComponent;
  let fixture: ComponentFixture<VendorProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorProfileHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
