import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsBatchClaimsComponent } from './dental-claims-batch-claims.component';

describe('DentalClaimsBatchClaimsComponent', () => {
  let component: DentalClaimsBatchClaimsComponent;
  let fixture: ComponentFixture<DentalClaimsBatchClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsBatchClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsBatchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
