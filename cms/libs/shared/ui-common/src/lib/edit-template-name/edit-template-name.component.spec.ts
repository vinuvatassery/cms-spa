import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTemplateNameComponent } from './edit-template-name.component';

describe('EditTemplateNameComponent', () => {
  let component: EditTemplateNameComponent;
  let fixture: ComponentFixture<EditTemplateNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTemplateNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTemplateNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
