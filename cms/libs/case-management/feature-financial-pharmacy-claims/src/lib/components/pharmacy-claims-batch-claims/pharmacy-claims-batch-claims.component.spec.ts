import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsBatchClaimsComponent } from './pharmacy-claims-batch-claims.component';

describe('PharmacyClaimsBatchClaimsComponent', () => {
  let component: PharmacyClaimsBatchClaimsComponent;
  let fixture: ComponentFixture<PharmacyClaimsBatchClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsBatchClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsBatchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
