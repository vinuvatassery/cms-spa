import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateLayoutPageComponent } from './template-layout-page.component';

describe('TemplateLayoutPageComponent', () => {
  let component: TemplateLayoutPageComponent;
  let fixture: ComponentFixture<TemplateLayoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateLayoutPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateLayoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
