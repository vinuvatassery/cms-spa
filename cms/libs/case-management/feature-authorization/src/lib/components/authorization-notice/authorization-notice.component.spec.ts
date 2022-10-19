import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationNoticeComponent } from './authorization-notice.component';

describe('AuthorizationNoticeComponent', () => {
  let component: AuthorizationNoticeComponent;
  let fixture: ComponentFixture<AuthorizationNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorizationNoticeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
