import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptApplicationComponent } from './accept-application.component';

describe('AcceptApplicationComponent', () => {
  let component: AcceptApplicationComponent;
  let fixture: ComponentFixture<AcceptApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptApplicationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
