import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTextMessageConfirmationComponent } from './send-text-message-confirmation.component';

describe('SendTextMessageConfirmationComponent', () => {
  let component: SendTextMessageConfirmationComponent;
  let fixture: ComponentFixture<SendTextMessageConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendTextMessageConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTextMessageConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
