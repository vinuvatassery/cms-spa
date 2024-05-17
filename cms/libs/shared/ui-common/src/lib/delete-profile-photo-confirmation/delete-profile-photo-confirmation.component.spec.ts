import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteProfilePhotoConfirmationComponent } from './delete-profile-photo-confirmation.component';

describe('DeleteProfilePhotoConfirmationComponent', () => {
  let component: DeleteProfilePhotoConfirmationComponent;
  let fixture: ComponentFixture<DeleteProfilePhotoConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteProfilePhotoConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProfilePhotoConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
