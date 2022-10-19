import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendLetterConfirmationComponent } from './send-letter-confirmation.component';

describe('SendLetterConfirmationComponent', () => {
  let component: SendLetterConfirmationComponent;
  let fixture: ComponentFixture<SendLetterConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendLetterConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendLetterConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
