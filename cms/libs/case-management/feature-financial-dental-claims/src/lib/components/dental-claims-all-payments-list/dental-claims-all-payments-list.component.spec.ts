import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DentalClaimsAllPaymentsListComponent } from './dental-claims-all-payments-list.component';

describe('DentalClaimsAllPaymentsListComponent', () => {
  let component: DentalClaimsAllPaymentsListComponent;
  let fixture: ComponentFixture<DentalClaimsAllPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsAllPaymentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsAllPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
