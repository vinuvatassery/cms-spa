import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsAndDocumentsPageComponent } from './forms-and-documents-page.component';

describe('FormsAndDocumentsPageComponent', () => {
  let component: FormsAndDocumentsPageComponent;
  let fixture: ComponentFixture<FormsAndDocumentsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsAndDocumentsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsAndDocumentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
