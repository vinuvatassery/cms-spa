import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsExpectationReasonComponent } from './approvals-expectation-reason.component';

describe('ApprovalsExpectationReasonComponent', () => {
  let component: ApprovalsExpectationReasonComponent;
  let fixture: ComponentFixture<ApprovalsExpectationReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsExpectationReasonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalsExpectationReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
