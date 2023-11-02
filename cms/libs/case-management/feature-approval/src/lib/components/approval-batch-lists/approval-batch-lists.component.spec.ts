import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalBatchListsComponent } from './approval-batch-lists.component';

describe('ApprovalBatchListsComponent', () => {
  let component: ApprovalBatchListsComponent;
  let fixture: ComponentFixture<ApprovalBatchListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalBatchListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalBatchListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
