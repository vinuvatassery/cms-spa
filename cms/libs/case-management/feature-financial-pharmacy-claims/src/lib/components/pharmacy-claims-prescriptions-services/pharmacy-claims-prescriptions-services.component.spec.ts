import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmacyClaimsPrescriptionsServicesComponent } from './pharmacy-claims-prescriptions-services.component';

describe('PharmacyClaimsPrescriptionsServicesComponent', () => {
  let component: PharmacyClaimsPrescriptionsServicesComponent;
  let fixture: ComponentFixture<PharmacyClaimsPrescriptionsServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsPrescriptionsServicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      PharmacyClaimsPrescriptionsServicesComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
