import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundBatchPageComponent } from './refund-batch-page.component';

describe('RefundBatchPageComponent', () => {
  let component: RefundBatchPageComponent;
  let fixture: ComponentFixture<RefundBatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefundBatchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundBatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
