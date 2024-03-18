import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateDeleteLanguageComponent } from './template-delete-language.component';

describe('TemplateDeleteLanguageComponent', () => {
  let component: TemplateDeleteLanguageComponent;
  let fixture: ComponentFixture<TemplateDeleteLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateDeleteLanguageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateDeleteLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
