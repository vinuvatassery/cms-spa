import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormDocumentsPageComponent } from './form-documents-page.component';

describe('FormDocumentsPageComponent', () => {
  let component: FormDocumentsPageComponent;
  let fixture: ComponentFixture<FormDocumentsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormDocumentsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDocumentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
