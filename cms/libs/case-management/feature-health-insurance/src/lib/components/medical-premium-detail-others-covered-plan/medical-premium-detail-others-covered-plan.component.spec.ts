import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumDetailOthersCoveredPlanComponent } from './medical-premium-detail-others-covered-plan.component';

describe('MedicalPremiumDetailOthersCoveredPlanComponent', () => {
  let component: MedicalPremiumDetailOthersCoveredPlanComponent;
  let fixture: ComponentFixture<MedicalPremiumDetailOthersCoveredPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumDetailOthersCoveredPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalPremiumDetailOthersCoveredPlanComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
