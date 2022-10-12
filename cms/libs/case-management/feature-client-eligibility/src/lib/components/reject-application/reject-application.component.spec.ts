import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectApplicationComponent } from './reject-application.component';

describe('RejectApplicationComponent', () => {
  let component: RejectApplicationComponent;
  let fixture: ComponentFixture<RejectApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectApplicationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
