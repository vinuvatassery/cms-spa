import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsDeleteClaimsComponent } from './pharmacy-claims-delete-claims.component';

describe('PharmacyClaimsDeleteClaimsComponent', () => {
  let component: PharmacyClaimsDeleteClaimsComponent;
  let fixture: ComponentFixture<PharmacyClaimsDeleteClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsDeleteClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsDeleteClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
