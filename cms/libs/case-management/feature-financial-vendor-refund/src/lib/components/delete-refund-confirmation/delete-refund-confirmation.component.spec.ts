import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRefundConfirmationComponent } from './delete-refund-confirmation.component';

describe('DeleteRefundConfirmationComponent', () => {
  let component: DeleteRefundConfirmationComponent;
  let fixture: ComponentFixture<DeleteRefundConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteRefundConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteRefundConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
