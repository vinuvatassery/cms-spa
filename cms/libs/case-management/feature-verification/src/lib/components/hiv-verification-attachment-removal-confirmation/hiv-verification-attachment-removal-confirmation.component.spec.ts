import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HivVerificationAttachmentRemovalConfirmationComponent } from './hiv-verification-attachment-removal-confirmation.component';

describe('HivVerificationAttachmentRemovalConfirmationComponent', () => {
  let component: HivVerificationAttachmentRemovalConfirmationComponent;
  let fixture: ComponentFixture<HivVerificationAttachmentRemovalConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HivVerificationAttachmentRemovalConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      HivVerificationAttachmentRemovalConfirmationComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
