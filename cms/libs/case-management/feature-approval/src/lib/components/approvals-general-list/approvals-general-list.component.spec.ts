import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsGeneralListComponent } from './approvals-general-list.component';

describe('ApprovalsGeneralListComponent', () => {
  let component: ApprovalsGeneralListComponent;
  let fixture: ComponentFixture<ApprovalsGeneralListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsGeneralListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalsGeneralListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
