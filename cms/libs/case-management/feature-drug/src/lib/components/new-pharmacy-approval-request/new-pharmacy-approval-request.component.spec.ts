import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPharmacyApprovalRequestComponent } from './new-pharmacy-approval-request.component';

describe('NewPharmacyApprovalRequestComponent', () => {
  let component: NewPharmacyApprovalRequestComponent;
  let fixture: ComponentFixture<NewPharmacyApprovalRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPharmacyApprovalRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPharmacyApprovalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
