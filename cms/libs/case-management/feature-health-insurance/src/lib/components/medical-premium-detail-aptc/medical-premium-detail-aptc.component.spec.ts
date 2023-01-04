import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumDetailAPTCComponent } from './medical-premium-detail-aptc.component';

describe('MedicalPremiumDetailAPTCComponent', () => {
  let component: MedicalPremiumDetailAPTCComponent;
  let fixture: ComponentFixture<MedicalPremiumDetailAPTCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumDetailAPTCComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumDetailAPTCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
