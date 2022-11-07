import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendLetterProfileComponent } from './send-letter-profile.component';

describe('SendLetterProfileComponent', () => {
  let component: SendLetterProfileComponent;
  let fixture: ComponentFixture<SendLetterProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendLetterProfileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendLetterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
