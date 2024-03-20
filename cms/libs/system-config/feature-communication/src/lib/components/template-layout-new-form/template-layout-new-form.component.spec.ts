import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateLayoutNewFormComponent } from './template-layout-new-form.component';

describe('TemplateLayoutNewFormComponent', () => {
  let component: TemplateLayoutNewFormComponent;
  let fixture: ComponentFixture<TemplateLayoutNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateLayoutNewFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateLayoutNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
