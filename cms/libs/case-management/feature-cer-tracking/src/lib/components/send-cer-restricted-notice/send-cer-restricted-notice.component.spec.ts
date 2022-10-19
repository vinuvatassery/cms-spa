import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCerRestrictedNoticeComponent } from './send-cer-restricted-notice.component';

describe('SendCerRestrictedNoticeComponent', () => {
  let component: SendCerRestrictedNoticeComponent;
  let fixture: ComponentFixture<SendCerRestrictedNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendCerRestrictedNoticeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCerRestrictedNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
