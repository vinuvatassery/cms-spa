import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmacyClaimsAllPaymentsListComponent } from './pharmacy-claims-all-payments-list.component';

describe('PharmacyClaimsAllPaymentsListComponent', () => {
  let component: PharmacyClaimsAllPaymentsListComponent;
  let fixture: ComponentFixture<PharmacyClaimsAllPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsAllPaymentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsAllPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
