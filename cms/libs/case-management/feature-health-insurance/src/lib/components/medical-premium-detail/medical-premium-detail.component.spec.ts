import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumDetailComponent } from './medical-premium-detail.component';

describe('MedicalPremiumDetailComponent', () => {
  let component: MedicalPremiumDetailComponent;
  let fixture: ComponentFixture<MedicalPremiumDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalPremiumDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
