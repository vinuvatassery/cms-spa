import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorNameComponent } from './vendor-name.component';

describe('VendorNameComponent', () => {
  let component: VendorNameComponent;
  let fixture: ComponentFixture<VendorNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
