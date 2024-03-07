import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterTemplateNewFormPageComponent } from './letter-template-new-form-page.component';

describe('LetterTemplateNewFormPageComponent', () => {
  let component: LetterTemplateNewFormPageComponent;
  let fixture: ComponentFixture<LetterTemplateNewFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LetterTemplateNewFormPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LetterTemplateNewFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
