import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterTemplateNewFormComponent } from './letter-template-new-form.component';

describe('LetterTemplateNewFormComponent', () => {
  let component: LetterTemplateNewFormComponent;
  let fixture: ComponentFixture<LetterTemplateNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LetterTemplateNewFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LetterTemplateNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
