import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalsGeneralListDetailExceptionsComponent } from './approvals-general-list-detail-exceptions.component';

describe('ApprovalsGeneralListDetailExceptionsComponent', () => {
  let component: ApprovalsGeneralListDetailExceptionsComponent;
  let fixture: ComponentFixture<ApprovalsGeneralListDetailExceptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsGeneralListDetailExceptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ApprovalsGeneralListDetailExceptionsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
