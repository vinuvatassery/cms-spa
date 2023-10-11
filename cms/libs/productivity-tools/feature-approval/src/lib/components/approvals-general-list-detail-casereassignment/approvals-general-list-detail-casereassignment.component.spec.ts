import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalsGeneralListDetailCaseReassignmentComponent } from './approvals-general-list-detail-casereassignment.component';

describe('ApprovalsGeneralListDetailCaseReassignmentComponent', () => {
  let component: ApprovalsGeneralListDetailCaseReassignmentComponent;
  let fixture: ComponentFixture<ApprovalsGeneralListDetailCaseReassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsGeneralListDetailCaseReassignmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ApprovalsGeneralListDetailCaseReassignmentComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
