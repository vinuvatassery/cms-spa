import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsEditItemsComponent } from './approvals-edit-items.component';

describe('ApprovalsEditItemsComponent', () => {
  let component: ApprovalsEditItemsComponent;
  let fixture: ComponentFixture<ApprovalsEditItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsEditItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalsEditItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
