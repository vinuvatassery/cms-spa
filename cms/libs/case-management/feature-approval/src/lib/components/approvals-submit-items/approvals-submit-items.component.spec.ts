import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsSubmitItemsComponent } from './approvals-submit-items.component';

describe('ApprovalsSubmitItemsComponent', () => {
  let component: ApprovalsSubmitItemsComponent;
  let fixture: ComponentFixture<ApprovalsSubmitItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsSubmitItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalsSubmitItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
