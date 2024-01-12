import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormDocumentsListComponent } from './form-documents-list.component';

describe('FormDocumentsListComponent', () => {
  let component: FormDocumentsListComponent;
  let fixture: ComponentFixture<FormDocumentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormDocumentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDocumentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
