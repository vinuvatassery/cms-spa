import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundNewFormDetailsComponent } from './refund-new-form-details.component';

describe('RefundNewFormDetailsComponent', () => {
  let component: RefundNewFormDetailsComponent;
  let fixture: ComponentFixture<RefundNewFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefundNewFormDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundNewFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
