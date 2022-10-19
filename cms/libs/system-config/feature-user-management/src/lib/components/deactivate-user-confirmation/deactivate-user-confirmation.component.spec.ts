import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateUserConfirmationComponent } from './deactivate-user-confirmation.component';

describe('DeactivateUserConfirmationComponent', () => {
  let component: DeactivateUserConfirmationComponent;
  let fixture: ComponentFixture<DeactivateUserConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivateUserConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateUserConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
