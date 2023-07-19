import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsPaymentsListComponent } from './approvals-payments-list.component';

describe('ApprovalsPaymentsListComponent', () => {
  let component: ApprovalsPaymentsListComponent;
  let fixture: ComponentFixture<ApprovalsPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsPaymentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalsPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
