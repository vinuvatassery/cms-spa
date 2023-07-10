import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundBatchesListComponent } from './refund-batches-list.component';

describe('RefundBatchesListComponent', () => {
  let component: RefundBatchesListComponent;
  let fixture: ComponentFixture<RefundBatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefundBatchesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundBatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
