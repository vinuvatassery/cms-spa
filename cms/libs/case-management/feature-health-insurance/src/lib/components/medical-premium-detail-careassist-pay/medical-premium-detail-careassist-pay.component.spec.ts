import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumDetailCareassistPayComponent } from './medical-premium-detail-careassist-pay.component';

describe('MedicalPremiumDetailCareassistPayComponent', () => {
  let component: MedicalPremiumDetailCareassistPayComponent;
  let fixture: ComponentFixture<MedicalPremiumDetailCareassistPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumDetailCareassistPayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalPremiumDetailCareassistPayComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
