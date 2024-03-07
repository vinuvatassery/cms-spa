import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterTemplateHeaderFooterPageComponent } from './letter-template-header-footer-page.component';

describe('LetterTemplateHeaderFooterPageComponent', () => {
  let component: LetterTemplateHeaderFooterPageComponent;
  let fixture: ComponentFixture<LetterTemplateHeaderFooterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LetterTemplateHeaderFooterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LetterTemplateHeaderFooterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
