import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumDetailMetalLevelComponent } from './medical-premium-detail-metal-level.component';

describe('MedicalPremiumDetailMetalLevelComponent', () => {
  let component: MedicalPremiumDetailMetalLevelComponent;
  let fixture: ComponentFixture<MedicalPremiumDetailMetalLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumDetailMetalLevelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumDetailMetalLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
