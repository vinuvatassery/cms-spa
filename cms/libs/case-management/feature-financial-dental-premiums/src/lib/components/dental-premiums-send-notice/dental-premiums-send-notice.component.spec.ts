import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsSendNoticeComponent } from './dental-premiums-send-notice.component';

describe('DentalPremiumsSendNoticeComponent', () => {
  let component: DentalPremiumsSendNoticeComponent;
  let fixture: ComponentFixture<DentalPremiumsSendNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsSendNoticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsSendNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
