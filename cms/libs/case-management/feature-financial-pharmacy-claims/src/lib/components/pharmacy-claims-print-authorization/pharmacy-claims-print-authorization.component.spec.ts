import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsPrintAuthorizationComponent } from './pharmacy-claims-print-authorization.component';

describe('PharmacyClaimsPrintAuthorizationComponent', () => {
  let component: PharmacyClaimsPrintAuthorizationComponent;
  let fixture: ComponentFixture<PharmacyClaimsPrintAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsPrintAuthorizationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsPrintAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
