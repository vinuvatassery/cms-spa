import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HivVerificationReviewComponent } from './hiv-verification-review.component';

describe('HivVerificationReviewComponent', () => {
  let component: HivVerificationReviewComponent;
  let fixture: ComponentFixture<HivVerificationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HivVerificationReviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HivVerificationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
