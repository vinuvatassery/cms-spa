import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumDetailClientPolicyHolderComponent } from './medical-premium-detail-client-policy-holder.component';

describe('MedicalPremiumDetailClientPolicyHolderComponent', () => {
  let component: MedicalPremiumDetailClientPolicyHolderComponent;
  let fixture: ComponentFixture<MedicalPremiumDetailClientPolicyHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumDetailClientPolicyHolderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalPremiumDetailClientPolicyHolderComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
