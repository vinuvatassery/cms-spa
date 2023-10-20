import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalRecentClaimsListComponent } from './approval-recent-claims-list.component';

describe('ApprovalRecentClaimsListComponent', () => {
  let component: ApprovalRecentClaimsListComponent;
  let fixture: ComponentFixture<ApprovalRecentClaimsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalRecentClaimsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalRecentClaimsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
