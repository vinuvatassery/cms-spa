import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateLayoutListsComponent } from './template-layout-lists.component';

describe('TemplateLayoutListsComponent', () => {
  let component: TemplateLayoutListsComponent;
  let fixture: ComponentFixture<TemplateLayoutListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateLayoutListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateLayoutListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
