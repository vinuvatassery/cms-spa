import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivatePhoneConfirmationComponent } from './deactivate-phone-confirmation.component';

describe('DeactivatePhoneConfirmationComponent', () => {
  let component: DeactivatePhoneConfirmationComponent;
  let fixture: ComponentFixture<DeactivatePhoneConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivatePhoneConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivatePhoneConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
