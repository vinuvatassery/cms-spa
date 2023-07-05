import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundProcessListComponent } from './refund-process-list.component';

describe('RefundProcessListComponent', () => {
  let component: RefundProcessListComponent;
  let fixture: ComponentFixture<RefundProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefundProcessListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
