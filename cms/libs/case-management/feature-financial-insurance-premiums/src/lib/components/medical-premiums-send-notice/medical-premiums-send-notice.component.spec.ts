import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsSendNoticeComponent } from './medical-premiums-send-notice.component';

describe('MedicalPremiumsSendNoticeComponent', () => {
  let component: MedicalPremiumsSendNoticeComponent;
  let fixture: ComponentFixture<MedicalPremiumsSendNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsSendNoticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsSendNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
