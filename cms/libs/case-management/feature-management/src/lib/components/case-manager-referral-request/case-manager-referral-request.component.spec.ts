import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseManagerReferralRequestComponent } from './case-manager-referral-request.component';

describe('CaseManagerReferralRequestComponent', () => {
  let component: CaseManagerReferralRequestComponent;
  let fixture: ComponentFixture<CaseManagerReferralRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseManagerReferralRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseManagerReferralRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
