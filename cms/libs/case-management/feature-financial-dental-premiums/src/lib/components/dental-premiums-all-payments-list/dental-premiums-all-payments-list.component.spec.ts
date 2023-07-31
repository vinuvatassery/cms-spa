import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DentalPremiumsAllPaymentsListComponent } from './dental-premiums-all-payments-list.component';

describe('DentalPremiumsAllPaymentsListComponent', () => {
  let component: DentalPremiumsAllPaymentsListComponent;
  let fixture: ComponentFixture<DentalPremiumsAllPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsAllPaymentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsAllPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
