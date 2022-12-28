import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumDetailGroupPlanTypeComponent } from './medical-premium-detail-group-plan-type.component';

describe('MedicalPremiumDetailGroupPlanTypeComponent', () => {
  let component: MedicalPremiumDetailGroupPlanTypeComponent;
  let fixture: ComponentFixture<MedicalPremiumDetailGroupPlanTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumDetailGroupPlanTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalPremiumDetailGroupPlanTypeComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
