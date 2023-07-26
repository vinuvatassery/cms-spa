import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsDetailFormComponent } from './medical-premiums-detail-form.component';

describe('MedicalPremiumsDetailFormComponent', () => {
  let component: MedicalPremiumsDetailFormComponent;
  let fixture: ComponentFixture<MedicalPremiumsDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsDetailFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
