import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressValidationComponent } from './address-validation.component';

describe('AddressValidationComponent', () => {
  let component: AddressValidationComponent;
  let fixture: ComponentFixture<AddressValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressValidationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
