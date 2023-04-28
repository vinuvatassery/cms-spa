import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusFplHistoryComponent } from './status-fpl-history.component';

describe('StatusFplHistoryComponent', () => {
  let component: StatusFplHistoryComponent;
  let fixture: ComponentFixture<StatusFplHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusFplHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusFplHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
