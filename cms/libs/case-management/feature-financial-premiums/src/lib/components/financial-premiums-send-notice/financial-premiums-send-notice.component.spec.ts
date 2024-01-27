import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsSendNoticeComponent } from './financial-premiums-send-notice.component';

describe('FinancialPremiumsSendNoticeComponent', () => {
  let component: FinancialPremiumsSendNoticeComponent;
  let fixture: ComponentFixture<FinancialPremiumsSendNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsSendNoticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsSendNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
