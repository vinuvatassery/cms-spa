import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusGroupHistoryComponent } from './status-group-history.component';

describe('StatusGroupHistoryComponent', () => {
  let component: StatusGroupHistoryComponent;
  let fixture: ComponentFixture<StatusGroupHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusGroupHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusGroupHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
