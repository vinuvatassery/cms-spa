import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsSearchClientsComponent } from './approvals-search-clients.component';

describe('ApprovalsSearchClientsComponent', () => {
  let component: ApprovalsSearchClientsComponent;
  let fixture: ComponentFixture<ApprovalsSearchClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalsSearchClientsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalsSearchClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
