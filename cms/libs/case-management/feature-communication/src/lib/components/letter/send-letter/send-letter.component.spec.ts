import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendLetterComponent } from './send-letter.component';

describe('SendLetterComponent', () => {
  let component: SendLetterComponent;
  let fixture: ComponentFixture<SendLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendLetterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
