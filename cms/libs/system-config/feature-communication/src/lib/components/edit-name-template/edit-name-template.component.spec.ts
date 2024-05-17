import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNameTemplateComponent } from './edit-name-template.component';

describe('EditNameTemplateComponent', () => {
  let component: EditNameTemplateComponent;
  let fixture: ComponentFixture<EditNameTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditNameTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditNameTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
