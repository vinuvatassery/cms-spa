import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateEmailConfirmationComponent } from './deactivate-email-confirmation.component';

describe('DeactivateEmailConfirmationComponent', () => {
  let component: DeactivateEmailConfirmationComponent;
  let fixture: ComponentFixture<DeactivateEmailConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivateEmailConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateEmailConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
