import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateAddressConfirmationComponent } from './deactivate-address-confirmation.component';

describe('DeactivateAddressConfirmationComponent', () => {
  let component: DeactivateAddressConfirmationComponent;
  let fixture: ComponentFixture<DeactivateAddressConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivateAddressConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateAddressConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
