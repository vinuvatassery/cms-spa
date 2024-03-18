import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateAddLanguageComponent } from './template-add-language.component';

describe('TemplateAddLanguageComponent', () => {
  let component: TemplateAddLanguageComponent;
  let fixture: ComponentFixture<TemplateAddLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateAddLanguageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateAddLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
