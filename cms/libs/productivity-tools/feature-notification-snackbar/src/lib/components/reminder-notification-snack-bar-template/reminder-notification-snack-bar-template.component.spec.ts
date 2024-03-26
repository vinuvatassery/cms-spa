import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReminderNotificationSnackBarsTemplateComponent } from './reminder-notification-snack-bar-template.component';

describe('ReminderNotificationSnackBarTemplateComponent', () => {
  let component: ReminderNotificationSnackBarsTemplateComponent;
  let fixture: ComponentFixture<ReminderNotificationSnackBarsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReminderNotificationSnackBarsTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ReminderNotificationSnackBarsTemplateComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
