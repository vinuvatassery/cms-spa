import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAndReminderPageComponent } from './notification-and-reminder-page.component';

describe('NotificationAndReminderPageComponent', () => {
  let component: NotificationAndReminderPageComponent;
  let fixture: ComponentFixture<NotificationAndReminderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationAndReminderPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationAndReminderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
