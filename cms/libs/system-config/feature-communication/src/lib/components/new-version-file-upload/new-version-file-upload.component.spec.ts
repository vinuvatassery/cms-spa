import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewVersionFileUploadComponent } from './new-version-file-upload.component';


describe('UploadFilesComponent', () => {
  let component: NewVersionFileUploadComponent;
  let fixture: ComponentFixture<NewVersionFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewVersionFileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewVersionFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
