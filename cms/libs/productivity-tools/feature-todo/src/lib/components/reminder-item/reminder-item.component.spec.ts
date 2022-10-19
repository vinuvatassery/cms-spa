import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderItemComponent } from './reminder-item.component';

describe('ReminderItemComponent', () => {
  let component: ReminderItemComponent;
  let fixture: ComponentFixture<ReminderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReminderItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
