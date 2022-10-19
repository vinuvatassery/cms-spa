import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveIncomeConfirmationComponent } from './remove-income-confirmation.component';

describe('RemoveIncomeConfirmationComponent', () => {
  let component: RemoveIncomeConfirmationComponent;
  let fixture: ComponentFixture<RemoveIncomeConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveIncomeConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveIncomeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
