import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReminderNotificationSnackBarTemplateComponent } from './reminder-notification-snack-bar-template.component';

describe('ReminderNotificationSnackBarTemplateComponent', () => {
  let component: ReminderNotificationSnackBarTemplateComponent;
  let fixture: ComponentFixture<ReminderNotificationSnackBarTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReminderNotificationSnackBarTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ReminderNotificationSnackBarTemplateComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
