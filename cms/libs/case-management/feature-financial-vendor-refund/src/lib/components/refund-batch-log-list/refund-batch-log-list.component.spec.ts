import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundBatchLogListComponent } from './refund-batch-log-list.component';

describe('RefundBatchLogListComponent', () => {
  let component: RefundBatchLogListComponent;
  let fixture: ComponentFixture<RefundBatchLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefundBatchLogListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundBatchLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
