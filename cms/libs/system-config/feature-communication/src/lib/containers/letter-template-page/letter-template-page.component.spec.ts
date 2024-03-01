import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterTemplatePageComponent } from './letter-template-page.component';

describe('LetterTemplatePageComponent', () => {
  let component: LetterTemplatePageComponent;
  let fixture: ComponentFixture<LetterTemplatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LetterTemplatePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LetterTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
