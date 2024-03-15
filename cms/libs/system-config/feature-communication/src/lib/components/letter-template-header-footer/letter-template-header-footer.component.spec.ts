import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterTemplateHeaderFooterComponent } from './letter-template-header-footer.component';

describe('LetterTemplateHeaderFooterComponent', () => {
  let component: LetterTemplateHeaderFooterComponent;
  let fixture: ComponentFixture<LetterTemplateHeaderFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LetterTemplateHeaderFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LetterTemplateHeaderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
