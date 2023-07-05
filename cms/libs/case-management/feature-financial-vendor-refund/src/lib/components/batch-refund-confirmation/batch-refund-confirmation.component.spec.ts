import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchRefundConfirmationComponent } from './batch-refund-confirmation.component';

describe('BatchRefundConfirmationComponent', () => {
  let component: BatchRefundConfirmationComponent;
  let fixture: ComponentFixture<BatchRefundConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchRefundConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchRefundConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
