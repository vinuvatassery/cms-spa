import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateLayoutNewFormPageComponent } from './template-layout-new-form-page.component';

describe('TemplateLayoutNewFormPageComponent', () => {
  let component: TemplateLayoutNewFormPageComponent;
  let fixture: ComponentFixture<TemplateLayoutNewFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateLayoutNewFormPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateLayoutNewFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
