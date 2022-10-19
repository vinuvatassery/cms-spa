import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReminderConfirmationComponent } from './delete-reminder-confirmation.component';

describe('DeleteReminderConfirmationComponent', () => {
  let component: DeleteReminderConfirmationComponent;
  let fixture: ComponentFixture<DeleteReminderConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteReminderConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteReminderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
