import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProofDocumentComponent } from './upload-proof-document.component';

describe('UploadProofDocumentComponent', () => {
  let component: UploadProofDocumentComponent;
  let fixture: ComponentFixture<UploadProofDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadProofDocumentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProofDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
