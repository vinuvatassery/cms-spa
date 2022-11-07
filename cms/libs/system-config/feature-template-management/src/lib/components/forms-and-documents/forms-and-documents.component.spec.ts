import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsAndDocumentsComponent } from './forms-and-documents.component';

describe('FormsAndDocumentsComponent', () => {
  let component: FormsAndDocumentsComponent;
  let fixture: ComponentFixture<FormsAndDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsAndDocumentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsAndDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
