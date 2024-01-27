import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsProviderInfoComponent } from './pharmacy-claims-provider-info.component';

describe('PharmacyClaimsProviderInfoComponent', () => {
  let component: PharmacyClaimsProviderInfoComponent;
  let fixture: ComponentFixture<PharmacyClaimsProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsProviderInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsProviderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
