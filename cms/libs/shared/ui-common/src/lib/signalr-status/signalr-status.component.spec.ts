import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalrStatusComponent } from './signalr-status.component';

describe('SignalrStatusComponent', () => {
  let component: SignalrStatusComponent;
  let fixture: ComponentFixture<SignalrStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignalrStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalrStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
