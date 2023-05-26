import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialReminderComponent } from './financial-reminder.component';

describe('FinancialReminderComponent', () => {
  let component: FinancialReminderComponent;
  let fixture: ComponentFixture<FinancialReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialReminderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
