import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsBatchClaimsComponent } from './medical-premiums-batch-claims.component';

describe('MedicalPremiumsBatchClaimsComponent', () => {
  let component: MedicalPremiumsBatchClaimsComponent;
  let fixture: ComponentFixture<MedicalPremiumsBatchClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsBatchClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsBatchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
