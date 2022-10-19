import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCerReminderComponent } from './send-cer-reminder.component';

describe('SendCerReminderComponent', () => {
  let component: SendCerReminderComponent;
  let fixture: ComponentFixture<SendCerReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendCerReminderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCerReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
