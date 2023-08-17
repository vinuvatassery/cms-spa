import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderNotificationSnackBarComponent} from './reminder-notification-snack-bar.component';

describe('ReminderNotificationSnackBarComponent', () => {
  let component: ReminderNotificationSnackBarComponent;
  let fixture: ComponentFixture<ReminderNotificationSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReminderNotificationSnackBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderNotificationSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
