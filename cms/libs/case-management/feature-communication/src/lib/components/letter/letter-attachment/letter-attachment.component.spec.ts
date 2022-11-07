import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterAttachmentComponent } from './letter-attachment.component';

describe('LetterAttachmentComponent', () => {
  let component: LetterAttachmentComponent;
  let fixture: ComponentFixture<LetterAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LetterAttachmentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
