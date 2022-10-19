import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextMessageEditorComponent } from './text-message-editor.component';

describe('TextMessageEditorComponent', () => {
  let component: TextMessageEditorComponent;
  let fixture: ComponentFixture<TextMessageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextMessageEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextMessageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
