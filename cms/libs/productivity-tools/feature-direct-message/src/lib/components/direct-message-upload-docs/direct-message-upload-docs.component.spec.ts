import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectMessageUploadDocsComponent } from './direct-message-upload-docs.component';

describe('DirectMessageUploadDocsComponent', () => {
  let component: DirectMessageUploadDocsComponent;
  let fixture: ComponentFixture<DirectMessageUploadDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectMessageUploadDocsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectMessageUploadDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
