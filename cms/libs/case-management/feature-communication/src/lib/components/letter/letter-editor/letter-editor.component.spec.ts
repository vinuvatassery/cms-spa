import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterEditorComponent } from './letter-editor.component';

describe('LetterEditorComponent', () => {
  let component: LetterEditorComponent;
  let fixture: ComponentFixture<LetterEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LetterEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
