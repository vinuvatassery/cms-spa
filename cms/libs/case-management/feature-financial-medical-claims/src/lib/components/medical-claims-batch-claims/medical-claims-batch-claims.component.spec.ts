import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsBatchClaimsComponent } from './medical-claims-batch-claims.component';

describe('MedicalClaimsBatchClaimsComponent', () => {
  let component: MedicalClaimsBatchClaimsComponent;
  let fixture: ComponentFixture<MedicalClaimsBatchClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsBatchClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsBatchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
