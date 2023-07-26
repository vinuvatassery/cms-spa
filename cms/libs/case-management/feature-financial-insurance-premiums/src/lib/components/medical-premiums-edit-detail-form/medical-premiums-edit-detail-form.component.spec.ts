import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsEditDetailFormComponent } from './medical-premiums-edit-detail-form.component';

describe('MedicalPremiumsEditDetailFormComponent', () => {
  let component: MedicalPremiumsEditDetailFormComponent;
  let fixture: ComponentFixture<MedicalPremiumsEditDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsEditDetailFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsEditDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
