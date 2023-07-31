import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsUnbatchClaimsComponent } from './pharmacy-claims-unbatch-claims.component';

describe('PharmacyClaimsUnbatchClaimsComponent', () => {
  let component: PharmacyClaimsUnbatchClaimsComponent;
  let fixture: ComponentFixture<PharmacyClaimsUnbatchClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsUnbatchClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsUnbatchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
