import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsReverseClaimsComponent } from './pharmacy-claims-reverse-claims.component';

describe('PharmacyClaimsReverseClaimsComponent', () => {
  let component: PharmacyClaimsReverseClaimsComponent;
  let fixture: ComponentFixture<PharmacyClaimsReverseClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsReverseClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsReverseClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
