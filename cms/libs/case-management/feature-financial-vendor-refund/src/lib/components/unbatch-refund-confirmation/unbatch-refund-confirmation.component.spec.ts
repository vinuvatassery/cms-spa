import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbatchRefundConfirmationComponent } from './unbatch-refund-confirmation.component';

describe('BatchRefundConfirmationComponent', () => {
  let component: UnbatchRefundConfirmationComponent;
  let fixture: ComponentFixture<UnbatchRefundConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnbatchRefundConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnbatchRefundConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
