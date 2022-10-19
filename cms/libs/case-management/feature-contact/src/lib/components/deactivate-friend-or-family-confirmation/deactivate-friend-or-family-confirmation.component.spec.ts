import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateFriendOrFamilyConfirmationComponent } from './deactivate-friend-or-family-confirmation.component';

describe('DeactivateFriendOrFamilyConfirmationComponent', () => {
  let component: DeactivateFriendOrFamilyConfirmationComponent;
  let fixture: ComponentFixture<DeactivateFriendOrFamilyConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivateFriendOrFamilyConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      DeactivateFriendOrFamilyConfirmationComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
