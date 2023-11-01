import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsReviewPossibleMatchesComponent } from './approvals-review-possible-matches.component';

describe('ApprovalsReviewPossibleMatchesComponent', () => {
  let component: ApprovalsReviewPossibleMatchesComponent;
  let fixture: ComponentFixture<ApprovalsReviewPossibleMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsReviewPossibleMatchesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalsReviewPossibleMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
